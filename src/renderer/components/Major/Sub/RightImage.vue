<template>
  <div class="right-image">
    <div v-if="selectedImages.length>0">
      <ImageDisplayer :imagesPath="selectedImageUrls"></ImageDisplayer>
      <ColorPan v-if="selectedImages.length===1" :colors="selectedImages[0].palettes"></ColorPan>
      <div class="selected-ind">
        {{selectedImages.length}} Selected
      </div>

      <input v-if="selectedImages.length===1" class="name-input" :value="selectedImages[0].name" placeholder="File Name" ref="nameInput" @keypress.enter="nameBlur" @blur="nameBlur" />
      <!-- TODO: icon to open url -->
      <input v-if="selectedImages.length>0" class="name-input" :value="computedURL" placeholder="http://" ref="urlInput" @blur="urlBlur" @keypress.enter="urlBlur" />
      <el-popover placement="left" v-model="tagPanelOpen" trigger="click" width="320">
        <TagPanel :activatedTags="imageTags" @tagClick="tagClick"></TagPanel>
        <div :class="{'image-tags':true,'keep-border':tagPanelOpen}" slot="reference">
          <draggable v-model="imageTags">
            <!-- TODO: Better D&D ex -->
            <Tag v-for="tag in imageTags" :name="tag" :key="tag" @tagClose="tagClose" />
          </draggable>

        </div>
      </el-popover>

      <textarea v-if="selectedImages.length>0" class="image-description" :value="computedDescription" placeholder="Description" ref="desInput" @blur="desBlur">
      </textarea>
      <div v-if="selectedImages.length===1&&imageFolderMap.length>0">
        <div class="title">
          In Folder
        </div>
        <div class="folder-tag">
          <Tag v-for="folder in imageFolderMap" :name="folder.name" :tagId="folder.id" :key="folder.id" @tagClose="folderClose" />
        </div>
      </div>
      <div v-if="selectedImages.length===1">
        <div class="title">
          Basic Info
        </div>
        <div class="info-row">
          <div class="row">
            <div class="left">Reso</div>
            <div class="right">{{selectedImages[0].width}} × {{selectedImages[0].height}}</div>
          </div>
          <div class="row">
            <div class="left">Image Size</div>
            <div class="right">{{(selectedImages[0].size/1024/1024).toFixed(3)}}MB</div>
          </div>
          <div class="row">
            <div class="left">File Type</div>
            <div class="right">{{selectedImages[0].ext.toUpperCase()}}</div>
          </div>
          <div class="row">
            <div class="left">Last Modified</div>
            <div class="right">{{dateToString(selectedImages[0].lastModified)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tag from './Tag'
import ImageDisplayer from './ImageDisplayer'
import TagPanel from './TagPanel'
import ColorPan from './ColorPan'
import path from 'path'
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import draggable from 'vuedraggable'

const TAG_PREFIX = '$$Create$$'
export default {
  components: {
    Tag,
    ImageDisplayer,
    ColorPan,
    TagPanel,
    draggable
  },
  data () {
    return {
      tagPanelOpen: false
    }
  },
  computed: {
    ...mapState({
      selectedImages (state) {
        let images = []
        state.App.selectedImageIds.forEach(id => {
          images.push(state.App.imageMap[id])
        })
        return images
      },
      selectedImageUrls (state) {
        let urls = this.selectedImages.map((item) => {
          let imageName = (item.width > 620 && item.height > 620) ? item.name + '_thumb.png' : item.name + '.' + item.ext
          let _path = 'file://' + path.join(state.App.libraryPath, 'images', item.id + '.image', imageName)
          return _path
        })
        return urls
      },
      imageFolderMap (state) {
        if (this.selectedImages && this.selectedImages.length === 1) {
          return this.selectedImages[0].folders.map(folderId => {
            return state.App.folderMap[folderId]
          }).filter(item => {
            return !!item
          })
        }
        return []
      },
      backSelectImagesId: state => state.App.backSelectImages
    }),
    imageTags: {
      get () {
        if (this.selectedImages && this.selectedImages.length > 0) {
          const tags = this.selectedImages.map(image => {
            return image.tags
          })
          return _.intersection(...tags)
        }
      },
      set (value) {
        let updateImage = {
          id: this.selectedImages[0].id,
          tags: value
        }
        ipcRenderer.send('bg-update-images', [updateImage])
      }
    },
    computedURL () {
      const urls = this.selectedImages.map(image => {
        return image.url
      })
      const same = urls.every(url => url === urls[0])
      if (same) {
        return urls[0]
      } else {
        return ''
      }
    },
    computedDescription () {
      const descriptions = this.selectedImages.map(image => {
        return image.description
      })
      const same = descriptions.every(description => description === descriptions[0])
      if (same) {
        return descriptions[0]
      } else {
        return ''
      }
    }
  },
  methods: {
    urlBlur (cancel) {
      if (this.selectedImages && this.selectedImages.length > 0) {
        this.selectedImages.forEach(image => {
          let updateImage = {
            id: image.id,
            url: this.$refs.urlInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        })
      } else if (this.backSelectImagesId) {
        console.log(this.backSelectImagesId)
        this.backSelectImagesId.forEach(id => {
          let updateImage = {
            id: id,
            url: this.$refs.urlInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        })
      }
    },
    nameBlur (cancel) {
      if (this.$refs.nameInput.value === '') {
        this.$refs.nameInput.value = this.selectedImages[0].name
      } else {
        // ipc
        if (this.selectedImages && this.selectedImages[0]) {
          let updateImage = {
            id: this.selectedImages[0].id,
            name: this.$refs.nameInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        } else if (this.backSelectImagesId && this.backSelectImagesId[0]) {
          let updateImage = {
            id: this.backSelectImagesId[0],
            name: this.$refs.nameInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        }
      }
    },
    desBlur (cancel) {
      if (this.selectedImages && this.selectedImages.length > 0) {
        this.selectedImages.forEach(image => {
          let updateImage = {
            id: image.id,
            description: this.$refs.desInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        })
      } else if (this.backSelectImagesId) {
        this.backSelectImagesId.forEach(id => {
          let updateImage = {
            id: id,
            description: this.$refs.desInput.value
          }
          ipcRenderer.send('bg-update-images', [updateImage])
        })
      }
    },
    tagClose (name) {
      if (this.selectedImages && this.selectedImages.length > 0) {
        this.selectedImages.forEach(image => {
          let index = image.tags.indexOf(name)
          if (index !== -1) {
            let cloned = _.cloneDeep(image.tags)
            cloned.splice(index, 1)
            let updateImage = {
              id: image.id,
              tags: cloned
            }
            ipcRenderer.send('bg-update-images', [updateImage])
          }
        })
      }
    },
    tagClick (name) {
      let realName = name
      if (name.indexOf(TAG_PREFIX) !== -1) {
        realName = name.slice(TAG_PREFIX.length)
      }
      if (this.selectedImages && this.selectedImages.length > 0) {
        let notContain = false
        this.selectedImages.forEach(image => {
          if (image.tags.indexOf(name) === -1) {
            notContain = true
          }
        })
        if (notContain) {
          this.selectedImages.forEach(image => {
            let cloned = _.cloneDeep(image.tags)
            cloned.push(realName)
            let updateImage = {
              id: image.id,
              tags: cloned
            }
            ipcRenderer.send('bg-update-images', [updateImage])
          })
        } else {
          this.tagClose(realName)
        }
      }
    },
    dateToString (timestamp) {
      // TODO: better time display
      let date = new Date(timestamp)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() + ' '
      let h = date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    folderClose ([name, id]) {
      const folders = _.clone(this.selectedImages[0].folders)
      const index = folders.indexOf(id)
      folders.splice(index, 1)
      let updateImage = {
        id: this.selectedImages[0].id,
        folders: folders
      }
      ipcRenderer.send('bg-update-images', [updateImage])
    }

  }
  // watch: {
  //   selectedImages (newV, oldV) {
  //     console.log(newV)
  //   }
  // }
}
</script>

<style lang="scss">

.el-popover {
  background-color: rgb(59, 59, 59) !important;
  border:0 !important;
  color: white;
  border: 0px;
  height: 400px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4) !important;
}
.popper__arrow{
  border-left-color:rgb(59, 59, 59) !important;
  &::after{
    border-left-color:rgb(59, 59, 59) !important;
  }
}
.el-popper[x-placement^="left"] .popper__arrow {
  border-left-color: rgb(59, 59, 59);
}
.el-popper .popper__arrow::after {
  content: none;
}
.right-image {
  height: calc(100% - 42px);
  overflow: scroll;
  overflow-x: hidden;
  // overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #535353;
  }
  .selected-image {
    width: 60%;
    display: block;
    margin: auto;
    margin-top: 16px;
    max-height: 200px;
    object-fit: cover;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.733);
  }
  .selected-ind {
    color: white;
    text-align: center;
    margin: 16px;
  }
  .name-input,
  .image-description {
    display: block;
    outline: none;
    border: 0px;
    width: 184px;
    border-radius: 4px;
    font-size: 12px;
    height: 24px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: rgb(39, 39, 39);
    color: white;
    margin: auto;
    margin-top: 24px;
    border: 1px solid transparent;
    transition: all 0.5s;
    &:focus {
      border: 1px solid rgb(49, 141, 226);
    }
  }
  .folder-tag {
    width: 202px;
    margin: auto;
    margin-top: 16px;
  }
  .image-tags {
    width: 184px;
    min-height: 100px;
    max-height: 200px;
    background-color: rgb(39, 39, 39);
    border-radius: 4px;
    margin: auto;
    margin-top: 16px;
    cursor: text;
    padding: 8px;
    border: 1px solid transparent;
    transition: all 0.5s;
    outline: none;
    overflow: auto;
    &:hover {
      border: 1px solid rgb(49, 141, 226);
    }
    &.keep-border {
      border: 1px solid rgb(49, 141, 226);
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #535353;
    }
  }
  .image-description {
    margin-top: 16px;
    padding-top: 8px;
    resize: none;
    height: 60px;
    line-height: 14px;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #535353;
    }
  }
  .title {
    color: white;
    font-size: 13px;
    margin-top: 16px;
    margin-left: 16px;
    margin-bottom: 8px;
  }
  .info-row {
    font-size: 12px;
    margin-left: 16px;
    color: rgba(255, 255, 255, 0.7);
  }
  .row {
    height: 20px;
    .left {
      float: left;
    }
    .right {
      float: right;
      margin-right: 16px;
    }
  }
}
</style>
