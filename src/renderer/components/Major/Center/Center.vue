<template>
  <div class="center-root">
    <!-- TODO: move to sub -->
    <div class="top-area">
      <div class="slider-wrapper">
        <vueSlider id="slider" v-model="zoomLevel" v-bind="options"> -->
        </vueSlider>
      </div>
      <div class="func-wrapper">
        <div class="sort-wrapper" :class="{'hidden':!changingSortType}">
          <div class="order-item" 
            :class="{'activated':Math.abs(imageSortType)===1,'inverse':imageSortType===-1}" 
            @click="sortType(1)">
            <span>N</span>
          </div>
          <div class="sep"></div>
          <div class="order-item" 
            :class="{'activated':Math.abs(imageSortType)===2,'inverse':imageSortType===-2}" 
            @click="sortType(2)">
            <span>M</span>
          </div>
          <div class="sep"></div>
          <div class="order-item" 
            :class="{'activated':Math.abs(imageSortType)===3,'inverse':imageSortType===-3}" 
            @click="sortType(3)">
            <span>S</span>
          </div>
          <div class="sep"></div>
        </div>
        <div class="order-wrapper" :class="{'activated':changingSortType}" @click="orderClick">
        </div>
        <div class="sep"></div>
        <div class="filter-wrapper ">
        </div>
        <div class="sep"></div>
        <div class="input-wrapper">
          <input :class="{keep:filterWord!==''}" v-model="filterWord" />
          <div class="search-in-input"></div>
        </div>
      </div>
    </div>

    <div class="container eg-container" @dragleave="dragleave($event)" @dragenter="dragenter($event)" @dragover="allowDrop($event)" @drop="drop($event)">
      <div class="type-folders" v-if="subFolders.length>0">
        Sub Folders ({{subFolders.length}})
        <div class="sub-folders">
          <GallyeryFolder v-for="sub in subFolders" v-bind:key="sub.id" :title="sub.name" :folderId="sub.id" :selectedSubFolder="selectedSubFolder" @click.native="subFolderClick(sub.id)" @dblclick.native="subFolderDBClick(sub.id)"></GallyeryFolder>
        </div>
      </div>
      <div class="type-images" v-if="imageCount>0 && subFolders.length>0">
        Images ({{imageCount}})
      </div>
      <InfiniteGrid ref="infinitegrid" v-if="filteredImages.length > 0" :list="filteredImages" :itemSize="itemSize" :selected="selected"></InfiniteGrid>
      <EmptyFolder v-if="imageCount===0 && (subFolders.length===0)" :type="filterWord.length===0?0:1"/>
      <!-- fileDragOver -->
    </div>
      <div class="drop-file-mask" :class="{'file-drag-over':fileDragOver}">
        <div v-if="fileDragOver" class="tip">
          Drop to add
        </div>
      </div>
  </div>
</template>
<script>
import vueSlider from 'vue-slider-component'
import ImageItem from './ImageItem'
import EmptyFolder from './EmptyFolder'
import InfiniteGrid from './InfiniteGrid'
import GallyeryFolder from './GallyeryFolder'
import store from '@/store'
import * as utils from '@/utils'
import { ipcRenderer } from 'electron'
import _ from 'lodash'
export default {
  components: {
    vueSlider,
    ImageItem,
    InfiniteGrid,
    EmptyFolder,
    GallyeryFolder
  },
  data () {
    return {
      fileDragOver: false,
      options: {
        tooltip: 'hover',
        min: 0,
        max: 6,
        interval: 0.2,
        'tooltip-dir': 'bottom',
        lazy: true
      },
      itemSize: 200,
      moving: false,
      startX: 0,
      startY: 0,
      selectRect: {},
      // selected: [],
      dragEnterCounter: 0,
      subFolders: []
    }
  },
  methods: {
    subFolderClick (id) {
      if (this.selectedSubFolder === id) {
        store.commit('SET_SELECTED_SUB_FOLDER', '')
      } else {
        store.commit('SET_SELECTED_SUB_FOLDER', id)
      }
    },
    subFolderDBClick (id) {
      store.dispatch('setSelectedFolder', id)
    },
    dragenter (event) {
      event.preventDefault()
      this.dragEnterCounter++
      if (!store.state.App.ImageDragging) {
        this.fileDragOver = true
      }
    },
    allowDrop (event) {
      event.preventDefault()
    },
    dragleave (event) {
      this.dragEnterCounter--
      if (this.dragEnterCounter === 0) {
        this.fileDragOver = false
      }
    },
    drop (event) {
      event.preventDefault()
      this.fileDragOver = false
      this.dragEnterCounter = 0
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        let files = [...event.dataTransfer.files]
        let result = files
          .filter(item => {
            return utils.imageType(item.type)
          })
          .map(file => {
            let data = {
              name: file.name,
              lastModified: file.lastModified,
              path: file.path,
              size: file.size,
              type: file.type
            }
            if (store.state.App.selectedFolder !== '$$all$$' &&
              store.state.App.selectedFolder !== '$$recent$$' &&
              store.state.App.selectedFolder !== '$$ttash$$') {
              data.folder = store.state.App.selectedFolder
            }
            return data
          })
        store.commit('SET_FILE_PROCESS_QUEUE_LENGTH', result.length)
        ipcRenderer.send('bg-add-local-images', { images: result })
      }
    },
    mousedown (e) {
      if ($(e.target).is('.container') && this.imageCount > 0) {
        store.commit('SET_SELECTED_SUB_FOLDER', '')
        this.moving = true
        this.startX = e.offsetX
        this.startY = e.offsetY + e.target.scrollTop
        if (!e.shiftKey) {
          this.selected = []
        }
        if ($('.container .mask').length === 0) {
          $('.container').append('<div class="mask"></div>')
        }
      }
    },
    mousemove (e) {
      if (this.moving) {
        let ig = this.$refs.infinitegrid.ig
        let offset = $('.container').offset()
        let endX = e.pageX - offset.left
        let endY = e.pageY - offset.top + $('.container').scrollTop()
        let flipX = this.startX > endX
        let flipY = this.startY > endY
        if (flipX) {
          endX = endX > 0 ? endX : 0
        }
        if (flipY) {
          endY = endY > 0 ? endY : 0
        }
        this.selectRect.width = parseInt(Math.abs(endX - this.startX))
        this.selectRect.height = parseInt(Math.abs(endY - this.startY))
        this.selectRect.x = this.startX
        this.selectRect.y = this.startY
        if (flipX) {
          this.selectRect.x = this.startX - this.selectRect.width
        }
        if (flipY) {
          this.selectRect.y = this.startY - this.selectRect.height
        }

        $('.mask').css({
          'left': this.selectRect.x + 'px',
          'top': this.selectRect.y + 'px',
          'width': this.selectRect.width + 'px',
          'height': this.selectRect.height + 'px'
        }).addClass('visible').show()
        let oTop = document.getElementsByClassName('vue-infinite-grid')[0].offsetTop
        var items = ig.getItems(true)
        var sLeft = this.selectRect.x
        var sTop = this.selectRect.y
        var sBottom = this.selectRect.height + sTop
        var sRight = this.selectRect.width + sLeft
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          var top = item.rect.top + oTop
          var left = item.rect.left
          var right = left + item.size.width
          var bottom = top + item.size.height

          var selected = !(
            sTop > bottom ||
            sBottom < top ||
            sLeft > right ||
            sRight < left)
          if (e.shiftKey) {
            var id = item.el.id.replace('item-', '')
            if (selected) {
              this.shiftSelected.push(id)
            }
          } else {
            if (selected) {
              $(item.el).addClass('selected')
            } else {
              $(item.el).removeClass('selected')
            }
          }
        }
      }
    },
    mouseup () {
      if (this.moving) {
        this.moving = false
        this.selectRect.width = 0
        this.selectRect.height = 0
        this.selectRect.x = 0
        this.selectRect.y = 0
        this.startX = 0
        this.startY = 0
        $('.container .mask').remove()
        let ig = this.$refs.infinitegrid.ig
        var items = ig.getItems()
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          if ($(item.el).hasClass('selected')) {
            var id = item.el.id.replace('item-', '')
            const cloned = _.clone(this.selected)
            cloned.push(id)
            this.selected = cloned
          }
        }
      }
    },
    itemClick (event) {
      event.stopPropagation()
      if (event.ctrlKey) {
        let $item = $('.item').has(event.target)
        let id = $item[0].id.replace('item-', '')
        if (this.selected.indexOf(id) === -1) {
          // add
          // this.selected.push(id)
          const cloned = _.clone(this.selected)
          cloned.push(id)
          this.selected = cloned
        } else {
          const cloned = _.clone(this.selected)
          cloned.splice(this.selected.indexOf(id), 1)
          this.selected = cloned
        }
        return
      }
      if (event.shiftKey && this.selected.length > 0) {
        let $item = $('.item').has(event.target)
        let endId = $item[0].id.replace('item-', '')
        let startId = this.selected[0]
        if (startId === endId) {
          this.selected = []
          return
        }
        this.selected = []
        let idList = this.filteredImages.map(item => {
          return item.id
        })
        let startIndex = idList.indexOf(startId)
        let endIndex = idList.indexOf(endId)
        let flip = false
        if (startIndex > endIndex) {
          flip = true
          let tmp = startIndex
          startIndex = endIndex
          endIndex = tmp
        }
        let selected = this.filteredImages.slice(startIndex, endIndex + 1)
        selected.forEach(item => {
          if (flip) {
            // this.selected.unshift(item.id)
            const cloned = _.clone(this.selected)
            cloned.unshift(item.id)
            this.selected = cloned
          } else {
            // this.selected.push(item.id)
            const cloned = _.clone(this.selected)
            cloned.push(item.id)
            this.selected = cloned
          }
        })
      } else {
        let $item = $('.item').has(event.target)
        let id = $item[0].id.replace('item-', '')
        if (this.selected.length <= 1 || this.selected.indexOf(id) === -1) {
          let $item = $('.item').has(event.target)
          let id = $item[0].id.replace('item-', '')
          this.selected = [id]
        }
      }
    },
    onScroll () {
    },
    sortType (type) {
      if (this.imageSortType === type) {
        store.commit('SET_IMAGE_SORT_TYPE', -type)
      } else {
        store.commit('SET_IMAGE_SORT_TYPE', type)
      }
    },
    orderClick () {
      store.commit('SET_SORT_TYPE', !this.changingSortType)
    }
  },
  computed: {
    selected: {
      get () {
        return store.state.App.selectedImageIds
      },
      set (value) {
        store.commit('SET_SELECTED_IMAGE_IDS', value)
      }
    },
    zoomLevel: {
      get () {
        return store.state.App.zoomLevel
      },
      set (value) {
        store.dispatch('setZoomLevel', value)
        this.itemSize = (value + 1) * 75
      }
    },
    filterWord: {
      get () {
        return store.state.App.filterWord
      },
      set (value) {
        store.commit('SET_FILTER_WORD', value)
      }
    },
    filteredImages () {
      return store.state.App.filteredImages
    },
    imageCount () {
      return store.state.App.filteredImages.length
    },
    selectedFolder () {
      return store.state.App.selectedFolder
    },
    selectedSubFolder () {
      return store.state.App.selectedSubFolder
    },
    folders () {
      return store.state.App.folders
    },
    imageSortType () {
      return store.state.App.imageSortType
    },
    changingSortType () {
      return store.state.Center.changingSortType
    }
  },
  mounted () {
    $('.container').on('click', '.item .thumbnail', this.itemClick)
    $('.container').on('mousedown', this.mousedown)
    $(document).on('mousemove', this.mousemove)
    $(document).on('mouseup', this.mouseup)
    if (store.state.App.folderMap[store.state.App.selectedFolder]) {
      this.subFolders = store.state.App.folderMap[store.state.App.selectedFolder].children
    }
  },
  watch: {
    selected (newV) {
      // store.commit('SET_SELECTED_IMAGE_IDS', _.cloneDeep(newV))
    },
    folders () {
      if (store.state.App.folderMap[store.state.App.selectedFolder]) {
        this.subFolders = store.state.App.folderMap[store.state.App.selectedFolder].children
      } else {
        this.subFolders = []
      }
    },
    selectedFolder () {
      if (store.state.App.folderMap[store.state.App.selectedFolder]) {
        this.subFolders = store.state.App.folderMap[store.state.App.selectedFolder].children
      } else {
        this.subFolders = []
      }
    }
  }

}
</script>
<style lang="scss">
.center-root {
  position: absolute;
  left: 230px;
  right: 230px;
  top: 0;
  bottom: 40px;
  overflow: hidden;
  .top-area {
    display: flex;
    position: relative;
    height: 40px;
    overflow: visible;
    width: 100%;
    border-bottom: 1px solid #282828;
    box-sizing: border-box;
    -webkit-app-region: drag;
    .slider-wrapper {
      -webkit-app-region: no-drag;
      width: 120px;
      margin: auto;
      color: white;
    }
    .sort-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      transition-duration: 0.4s;
      overflow: hidden;
      width: 94px;
      &.hidden {
        width: 0;
      }
    }
    .func-wrapper {
      -webkit-app-region: no-drag;
      position: absolute;
      right: 8px;
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .input-wrapper {
        height: 24px;
        overflow: hidden;
        -webkit-app-region: no-drag;
        position: relative;
        input {
          -webkit-app-region: no-drag;
          display: block;
          outline: none;
          border: 0px;
          border-radius: 2px;
          width: 24px;
          height: 20px;
          background-color: transparent;
          color: white;
          overflow: hidden;
          &:hover,
          &:focus,
          &.keep {
            background-color: rgb(39, 39, 39);
            width: calc(160px - 22px);
            padding-left: 8px;
            padding-right: 22px;
          }
          border: 1px solid transparent;
          transition: all 0.3s ease, border 0.5s;
          &:focus {
            border: 1px solid rgb(49, 141, 226);
          }
          &:disabled {
            cursor: not-allowed;
          }
        }
        .search-in-input {
          width: 24px;
          background-size: 18px;
          transition: all 0.3s;
          top: 0;
          bottom: 0;
          right: 0;
        }
      }
      .order-item {
        padding: 4px;
        border-radius: 2px;
        width: 18px;
        height: 18px;
        color: white;
        line-height: 18px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          background-color: #404040;
        }
        &.activated {
          background-color: rgba(82, 82, 82, 0.685);
        }
        &.inverse {
          transform: rotate(180deg);
        }
      }

      .order-wrapper,
      .filter-wrapper {
        padding: 3px;
        border-radius: 2px;
        width: 18px;
        height: 18px;
        background: url(/static/svg/filter.svg) center no-repeat;
        background-size: 20px;
        border: 1px solid transparent;
        transition: border 0.4s;
        &:hover {
          background-color: #404040;
        }
        &.activated {
          background-color: rgba(82, 82, 82, 0.685);
          border: 1px solid #318de2;
        }
      }
      .order-wrapper {
        background: url(/static/svg/order.svg) center no-repeat;
        background-size: 20px;
      }
    }
  }
}

.container {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: calc(100%);
  background-color: #2d2d2d;
  overflow: auto;
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
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(94, 94, 94, 0.24);
    &:hover {
      background-color: rgb(80, 80, 80);
    }
  }
}

.vue-slider-component {
  -webkit-app-region: no-drag;
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

