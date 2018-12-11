<template>
  <div class="gallery-folder">
    <div class="wrapper" :class="{'selected':selectedSubFolder===folderId}">
      <div class="image-container">
        <div class="item-left">
          <img class="folder-cover" v-if="folderImagesURL.length>=1" :src="folderImagesURL[0]">
        </div>
        <div class="item-right">
          <div class="item-right-top">
            <img class="folder-cover" v-if="folderImagesURL.length>=2" :src="folderImagesURL[1]">
          </div>
          <div class="item-right-bottom">
            <img class="folder-cover" v-if="folderImagesURL.length>=3" :src="folderImagesURL[2]">
          </div>
        </div>
      </div>
    </div>

    <div class="folder-title">{{title}}</div>
    <div class="folder-info">
      {{
      folderImages.length===0&&subFolderInfo.length===0?
      'Empty Folder':
      (folderImages.length===0?
      `${subFolderInfo.length} SubFolders`:
      ((`${folderImages.length}`+(folderImages.length>1?' Images':' Image')) + (subFolderInfo.length > 0 ? ` &middot; ${subFolderInfo.length} SubFolder`:''))
      )
      }}
    </div>
  </div>
</template>

<script>
// gen all folder cover image in vuex
import store from "@/store";
import path from "path";
import { mapState } from "vuex";
// import _ from 'lodash'
import * as utils from "@/utils";
export default {
  props: {
    title: {
      type: String,
      default: "Sub Folder"
    },
    folderId: {
      type: String,
      default: ""
    },
    selectedSubFolder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    folderImagesURL() {
      return this.folderImages.map(item => {
        let imageName =
          item.width > 620 && item.height > 620
            ? item.name + "_thumb.png"
            : item.name + "." + item.ext;
        let _path =
          "file://" +
          path.join(
            store.state.App.libraryPath,
            "images",
            item.id + ".image",
            imageName
          );
        return _path;
      });
    },
    subFolderInfo() {
      return utils.folderChildren(store.state.App.folders, this.folderId) || [];
    },
    ...mapState({
      folderImages(state) {
        let subFolderIds = this.subFolderInfo.map(item => {
          return item.id;
        });
        subFolderIds.push(this.folderId);
        let result = [];
        subFolderIds.forEach(id => {
          const imagesInFolder = state.App.image2FolderMap[id];
          if (imagesInFolder) {
            result = result.concat(imagesInFolder);
          }
        });
        return result;
      }
    })
  },
  methods: {},
  mounted() {
    $(".folder-cover").on("mousedown", function(e) {
      e.preventDefault();
    });
  }
};
</script>

<style lang="scss">
.gallery-folder {
  color: rgb(122, 122, 122);
  text-align: center;
  margin: 4px;
  box-sizing: border-box;
  overflow: hidden;
  .wrapper {
    padding: 3px;
    border: 2px solid transparent;
    border-radius: 4px;
    box-sizing: border-box;
    &.selected {
      border: 2px solid rgb(49, 141, 226);
    }
  }
  .image-container {
    border-radius: 4px;
    overflow: hidden;
    height: 120px;
    width: 200px;
    pointer-events: all;
    .item-left,
    .item-right {
      width: calc(70% - 2px);
      height: 100%;
      background-color: rgb(92, 92, 92);
      float: left;
    }
    .item-right {
      background-color: transparent;
      float: right;
      width: calc(30% - 2px);
      .item-right-top,
      .item-right-bottom {
        height: calc(50% - 2px);
        background-color: rgb(92, 92, 92);
      }
      .item-right-bottom {
        margin-top: 4px;
      }
    }
  }
  .folder-title {
    margin-top: 4px;
    color: white;
    pointer-events: none;
  }
  .folder-info {
    font-size: 90%;
    margin-top: 2px;
    pointer-events: none;
  }
}
.folder-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
