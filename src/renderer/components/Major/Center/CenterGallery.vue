<template>
  <div>
    <div
      class="container eg-container"
      @dragleave="dragleave($event)"
      @dragenter="dragenter($event)"
      @dragover="allowDrop($event)"
      @drop="drop($event)"
    >
      <div class="type-folders" v-if="subFolders.length>0">
        Sub Folders ({{subFolders.length}})
        <div class="sub-folders">
          <GalleryFolder
            v-for="sub in subFolders"
            v-bind:key="sub.id"
            :title="sub.name"
            :folderId="sub.id"
            :selectedSubFolder="selectedSubFolder"
            @click.native="subFolderClick(sub.id)"
            @dblclick.native="subFolderDBClick(sub.id)"
          ></GalleryFolder>
        </div>
      </div>
      <div class="type-images" v-if="imageCount>0 && subFolders.length>0">Images ({{imageCount}})</div>
      <InfiniteGrid ref="infinitegrid" v-if="filteredImages.length > 0"></InfiniteGrid>
      <EmptyFolder
        v-if="imageCount===0 && (subFolders.length===0)"
        :type="filterWord.length===0?0:1"
      />
    </div>
    <div class="drop-file-mask" :class="{'file-drag-over':fileDragOver}">
      <div v-if="fileDragOver" class="tip">Drop to add</div>
    </div>
  </div>
</template>

<script>
import GalleryFolder from "./GalleryFolder";
import store from "@/store";
import InfiniteGrid from "./InfiniteGrid";
import * as utils from "@/utils";
import { ipcRenderer } from "electron";
import EmptyFolder from "./EmptyFolder";
import _ from "lodash";
export default {
  components: {
    InfiniteGrid,
    EmptyFolder,
    GalleryFolder
  },
  data() {
    return {
      fileDragOver: false,
      itemSize: 200,
      moving: false,
      startX: 0,
      startY: 0,
      selectRect: {},
      dragEnterCounter: 0,
      selectedMap: {}
    };
  },
  methods: {
    subFolderClick(id) {
      if (this.selectedSubFolder === id) {
        this.selectedSubFolder = "";
      } else {
        this.selectedSubFolder = id;
      }
    },
    subFolderDBClick(id) {
      store.dispatch("setSelectedFolder", id);
    },
    dragenter(event) {
      event.preventDefault();
      this.dragEnterCounter++;
      if (!store.state.App.ImageDragging) {
        this.fileDragOver = true;
      }
    },
    allowDrop(event) {
      event.preventDefault();
    },
    dragleave(event) {
      this.dragEnterCounter--;
      if (this.dragEnterCounter === 0) {
        this.fileDragOver = false;
      }
    },
    drop(event) {
      event.preventDefault();
      this.fileDragOver = false;
      this.dragEnterCounter = 0;
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        let files = [...event.dataTransfer.files];
        let result = files
          .filter(item => {
            return utils.imageType(item.type);
          })
          .map(file => {
            let data = {
              name: file.name,
              lastModified: file.lastModified,
              path: file.path,
              size: file.size,
              type: file.type
            };
            if (
              store.state.App.selectedFolder !== "$$all$$" &&
              store.state.App.selectedFolder !== "$$recent$$" &&
              store.state.App.selectedFolder !== "$$ttash$$"
            ) {
              data.folder = store.state.App.selectedFolder;
            }
            return data;
          });
        store.commit("SET_FILE_PROCESS_QUEUE_LENGTH", result.length);
        ipcRenderer.send("bg-add-local-images", { images: result });
      }
    },
    itemClick(event) {
      event.stopPropagation();
      if (event.ctrlKey) {
        let $item = $(".item").has(event.target);
        let id = $item[0].id.replace("item-", "");
        if (this.selected.indexOf(id) === -1) {
          const cloned = _.clone(this.selected);
          cloned.push(id);
          this.selected = cloned;
        } else {
          const cloned = _.clone(this.selected);
          cloned.splice(this.selected.indexOf(id), 1);
          this.selected = cloned;
        }
        return;
      }
      if (event.shiftKey && this.selected.length > 0) {
        let $item = $(".item").has(event.target);
        let endId = $item[0].id.replace("item-", "");
        let startId = this.selected[0];
        if (startId === endId) {
          this.selected = [];
          return;
        }
        this.selected = [];
        let idList = this.filteredImages.map(item => {
          return item.id;
        });
        let startIndex = idList.indexOf(startId);
        let endIndex = idList.indexOf(endId);
        let flip = false;
        if (startIndex > endIndex) {
          flip = true;
          let tmp = startIndex;
          startIndex = endIndex;
          endIndex = tmp;
        }
        let selected = this.filteredImages.slice(startIndex, endIndex + 1);
        selected.forEach(item => {
          if (flip) {
            const cloned = _.clone(this.selected);
            cloned.unshift(item.id);
            this.selected = cloned;
          } else {
            const cloned = _.clone(this.selected);
            cloned.push(item.id);
            this.selected = cloned;
          }
        });
      } else {
        let $item = $(".item").has(event.target);
        let id = $item[0].id.replace("item-", "");
        if (this.selected.length <= 1 || this.selected.indexOf(id) === -1) {
          let $item = $(".item").has(event.target);
          let id = $item[0].id.replace("item-", "");
          this.selected = [id];
        }
      }
    },
    mousedown(e) {
      if (e.button === 2 && $(e.target).is(".thumbnial-img")) {
        return;
      }
      if (e.button === 2 && $(e.target).is(".container")) {
        return;
      }
      if (!this.moving && $(e.target).is(".container") && this.imageCount > 0) {
        if (e.clientX > e.target.clientWidth + $(e.target).offset().left) {
          return;
        }
        this.selectedSubFolder = "";
        this.moving = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY + e.target.scrollTop;
        if (!e.shiftKey) {
          this.selected = [];
        }
        if ($(".container .mask").length === 0) {
          $(".container").append('<div class="mask"></div>');
        }
      }
    },
    mousemove(eve) {
      if (this.moving) {
        let offset = $(".container").offset();
        let endX = eve.pageX - offset.left;
        let endY = eve.pageY - offset.top + $(".container").scrollTop();
        let flipX = this.startX > endX;
        let flipY = this.startY > endY;
        if (flipX) {
          endX = endX > 0 ? endX : 0;
        }
        if (flipY) {
          endY = endY > 0 ? endY : 0;
        }
        this.selectRect.width = parseInt(Math.abs(endX - this.startX));
        this.selectRect.height = parseInt(Math.abs(endY - this.startY));
        this.selectRect.x = this.startX;
        this.selectRect.y = this.startY;
        if (flipX) {
          this.selectRect.x = this.startX - this.selectRect.width;
        }
        if (flipY) {
          this.selectRect.y = this.startY - this.selectRect.height;
        }

        $(".mask")
          .css({
            left: this.selectRect.x + "px",
            top: this.selectRect.y + "px",
            width: this.selectRect.width + "px",
            height: this.selectRect.height + "px"
          })
          .addClass("visible")
          .show();
        this.check(eve);
      }
    },
    mouseup() {
      if (!this.moving) {
        return;
      }
      this.moving = false;
      this.selectRect.width = 0;
      this.selectRect.height = 0;
      this.selectRect.x = 0;
      this.selectRect.y = 0;
      this.startX = 0;
      this.startY = 0;
      $(".container .mask").remove();
      setTimeout(() => {
        const cloned = _.clone(this.selected);
        for (let key of Object.keys(this.selectedMap)) {
          if (this.selectedMap[key]) {
            cloned.push(key);
          }
        }
        this.selectedMap = {};
        this.selected = cloned;
      }, 200);
    },
    check: _.throttle(function(e) {
      if (!this.moving) {
        return;
      }
      let ig = this.$refs.infinitegrid.ig;
      let oTop = document.getElementsByClassName("vue-infinite-grid")[0]
        .offsetTop;
      let items = ig.getItems(true);
      let sLeft = this.selectRect.x;
      let sTop = this.selectRect.y;
      let sBottom = this.selectRect.height + sTop;
      let sRight = this.selectRect.width + sLeft;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item || !item.el) {
          continue;
        }
        let top = item.rect.top + oTop;
        let left = item.rect.left;
        let right = left + item.size.width;
        let bottom = top + item.size.height;

        let selected = !(
          sTop > bottom ||
          sBottom < top ||
          sLeft > right ||
          sRight < left
        );

        let id = item.el.id.replace("item-", "");
        if (e.shiftKey) {
          if (selected) {
            this.shiftSelected.push(id);
          }
        } else {
          this.selectedMap[id] = selected;
          if (selected) {
            $(item.el).addClass("selected");
          } else {
            $(item.el).removeClass("selected");
          }
        }
      }
    }, 150)
  },
  mounted() {
    $(".container").on("click", ".item .thumbnail", this.itemClick);
    $(".container").on("mousedown", this.mousedown);
    $(document).on("mousemove", this.mousemove);
    $(document).on("mouseup", this.mouseup);
  },
  computed: {
    subFolders() {
      return store.state.App.folderMap[store.state.App.selectedFolder]
        ? store.state.App.folderMap[store.state.App.selectedFolder].children
        : [];
    },
    imageCount: {
      get() {
        return store.state.App.filteredImages.length;
      }
    },
    filteredImages: {
      get() {
        return store.state.App.filteredImages;
      }
    },
    selected: {
      get() {
        return store.state.App.selectedImageIds;
      },
      set(value) {
        store.commit("SET_SELECTED_IMAGE_IDS", value);
      }
    },
    filterWord: {
      get() {
        return store.state.App.filterWord;
      }
    },

    selectedFolder: {
      get() {
        return store.state.App.selectedFolder;
      }
    },
    selectedSubFolder: {
      get() {
        return store.state.App.selectedSubFolder;
      },
      set(value) {
        store.commit("SET_SELECTED_SUB_FOLDER", value);
      }
    },
    folders: {
      get() {
        return store.state.App.folders;
      }
    },
    imageSortType: {
      get() {
        return store.state.App.imageSortType;
      },
      set(value) {
        store.commit("SET_IMAGE_SORT_TYPE", value);
      }
    },
    layoutType: {
      get() {
        return store.state.App.layoutType;
      },
      set(value) {
        store.commit("SET_LAYOUT_TYPE", value);
      }
    },
    zoomLevel: {
      get() {
        return store.state.App.zoomLevel;
      }
    }
  },
  beforeDestroy() {
    $(".container").off("click", ".item .thumbnail", this.itemClick);
    $(".container").off("mousedown", this.mousedown);
    $(document).off("mousemove", this.mousemove);
    $(document).off("mouseup", this.mouseup);
  }
};
</script>

<style lang="scss">
.container {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: calc(100%);
  background-color: #2d2d2d;
  overflow: auto;
  overflow-x: hidden;
  margin: auto;
  .type-images,
  .type-folders {
    color: rgb(211, 211, 211);
    margin-top: 4px;
    margin-left: 8px;
    font-size: 90%;
    .sub-folders {
      display: flex;
      flex-flow: row wrap;
      margin-left: 24px;
    }
    pointer-events: none;
  }
  .mask {
    position: absolute;
    width: 0px;
    height: 0px;
    left: 0;
    top: 0;
    background-color: transparent;
    z-index: 100;
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid transparent;
    &.visible {
      background-color: rgba(rgb(49, 141, 226), 0.35);
      border: 1px solid rgb(49, 141, 226);
    }
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    // border:2px solid black;
    box-sizing: border-box;
    background-color: rgba(94, 94, 94, 0.24);
    &:hover {
      background-color: rgb(80, 80, 80);
    }
  }
}
.drop-file-mask {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 40px;
  background-color: transparent;
  box-sizing: border-box;
  border: 1px solid transparent;
  height: calc(100% - 41px);
  width: calc(100% - 1px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &.file-drag-over {
    border-color: rgb(49, 141, 226);
    background-color: rgba(rgb(49, 141, 226), 0.15);
  }
  .tip {
    padding: 0 50px;
    line-height: 72px;
    height: 72px;
    border-radius: 3px;
    background-color: rgb(49, 141, 226);
    color: white;
    pointer-events: none;
  }
}
</style>
