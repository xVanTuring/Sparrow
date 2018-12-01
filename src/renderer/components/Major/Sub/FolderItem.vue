<template>
  <div @dblclick="folderClick"  :class="{'folder-item':true, selected:selected,'drag-over':dragOvering}" @dragover="dragOver($event)" @dragleave="dragLeave($event)" @drop="drop($event)">
    <div class="selected-indicator"></div>
    <img v-if="type==='all'" src="@/assets/svgs/all.svg" />
    <img v-if="type==='recent'" src="@/assets/svgs/clock.svg" />
    <img v-if="type==='tags'" src="@/assets/svgs/tag.svg" />
    <img v-if="type==='trash'" src="@/assets/svgs/trash.svg" />
    <IconFolder v-if="type==='folder'" @click.native="folderClick" :open="childCount!==0&&open" :class="{'folder':type==='folder'}"></IconFolder>
    <div class="title" v-if="!(title==='$$RENAME$$')||rename" @dblclick="renameClick">
      {{title}}
    </div>
    <input v-if="(type==='folder'&&title==='$$RENAME$$')||rename" ref="nameInput" v-focus class="name-input" @blur="blur" @keyup.enter="blur" />
    <div class="number">
      {{count>0?count:''}}
    </div>
  </div>
</template>

<script>
import IconFolder from '../Icons/IconFolder'
import { fixedFolderID } from '@/utils/constants'
import { ipcRenderer } from 'electron'
import store from '@/store'
import _ from 'lodash'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    open: {
      type: Boolean,
      default: true
    },
    childCount: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    },
    extra: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dragOvering: false,
      tmpName: '',
      rename: false
    }
  },
  components: {
    IconFolder
  },
  computed: {
    selectedFolder () {
      return store.state.App.selectedFolder
    }
  },
  methods: {
    folderClick () {
      if (this.type === 'folder') {
        if (this.extra.data && this.extra.store) {
          this.extra.store.toggleOpen(this.extra.data)
        }
      }
    },
    dragOver (event) {
      if (this.type === 'folder' || this.type === 'trash' || this.type === 'all') {
        event.preventDefault()
        // console.log('1: ' + event.ctrlKey)
        if (!this.dragOvering) {
          this.dragOvering = true
        }
      }
    },
    dragLeave (event) {
      event.preventDefault()
      this.dragOvering = false
    },
    drop (event) {
      event.preventDefault()
      this.dragOvering = false
      let list = JSON.parse(event.dataTransfer.getData('list') || '[]')
      if (list.length === 0) { return }
      let images
      switch (this.id) {
        case fixedFolderID.all:
          images = list.map((item) => {
            this.$bus.$emit('remove-item', [item])
            return {
              id: item,
              isDeleted: false
            }
          })
          ipcRenderer.send('bg-update-images', images)
          break
        case fixedFolderID.trash:
          images = list.map((item) => {
            this.$bus.$emit('remove-item', [item])
            return {
              id: item,
              isDeleted: true
            }
          })
          ipcRenderer.send('bg-update-images', images)
          break
        default:
          images = list.map((item) => {
            const img = store.state.App.imageMap[item]
            let folders = _.clone(img.folders)
            if (!event.ctrlKey && this.selectedFolder !== fixedFolderID.all && img.folders.indexOf(this.id) === -1) {
              this.$bus.$emit('remove-item', [item])
            }
            if (event.ctrlKey) {
              // validate
              folders = folders.filter(id => {
                return !!store.state.App.folderMap[id]
              })
              folders.push(this.id)
              folders = Array.from(new Set(folders))
            } else {
              folders = [this.id]
            }
            return {
              id: item,
              folders: folders,
              isDeleted: false
            }
          })

          ipcRenderer.send('bg-update-images', images)
          break
      }
    },
    blur () {
      if (this.$refs.nameInput.value.length > 0) {
        let value = this.$refs.nameInput.value !== '$$RENAME$$' ? this.$refs.nameInput.value : 'No Name'
        this.$emit('folderRename', [this.id, value])
        this.rename = false
      }
    },
    renameClick () {
      if (!this.rename && this.type === 'folder') {
        this.tmpName = this.title
        this.rename = true
      }
    },
    contextMenu (event) {
      event.preventDefault()
    }
  },
  directives: {
    focus: {
      inserted: function (el, binding, vnode) {
        el.focus()
        el.value = vnode.context.title === '$$RENAME$$' ? '' : vnode.context.title
        el.setSelectionRange(0, el.value.length)
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">

.folder-item {
  user-select: none;
  cursor: default;
  position: relative;
  color: white;
  height: 38px;
  width: 100%;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(75, 75, 75, 0.5);
  }
  &.selected {
    background-color: rgba(82, 82, 82, 0.685);
    // 4B4B4B
    .selected-indicator {
      position: absolute;
      right: 0;
      width: 4px;
      background-color: rgb(49, 141, 226);
      height: 100%;
    }
  }
  &.drag-over {
    background-color: rgba($color: rgb(49, 141, 226), $alpha: 0.7);
  }
  .folder,
  img {
    position: absolute;
    left: 12px;
    top: 8px;
    display: block;
    width: 22px;
  }
  .name-input {
    position: absolute;
    display: block;
    left: 36px;
    width: calc(60%);
    top: 6px;
    border: 0px;
    outline: none;
    height: 24px;
    background-color: rgb(58, 58, 58);
    color: white;
    font-size: 14px;
    padding-left: 6px;
    padding-right: 4px;
    border-radius: 2px;
    font-family: monospace;
  }

  .title {
    font-family: monospace;
    overflow: hidden;
    position: absolute;
    left: 42px;
    font-size: 14px;
    height: 38px;
    line-height: 38px;
  }
  .number {
    position: absolute;
    font-size: 12px;
    line-height: 42px;
    right: 12px;
    pointer-events: none;
    text-align: right;
  }
}
</style>
