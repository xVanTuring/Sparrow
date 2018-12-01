<template>
  <div class="right-folder">
    <div v-if="currentFolder!=null">
      <input
            class="name-input"
            placeholder="Folder Name"
            :value="currentFolder.name"
            @blur="blur"
            @keypress.enter="blur"
            :disabled="currentFolder.fixed"
            ref="nameInput"/>
      <div class="title">
        Basic Info
      </div>
      <div class="info-row">
        <div class="row">
          <div class="left">File Counts</div>
          <div class="right">{{currentFolder.imagesCount===0?'Empty':currentFolder.imagesCount}}</div>
        </div>
        <div class="row">
          <div class="left">Folder Files Size</div>
          <div class="right">{{currentFolder.size===0?'Empty':currentFolder.size}}</div>
        </div>
        <!-- <div class="row">
          <div class="left">Create Time</div>
          <div class="right"> 1234/45/78 9:00</div>
        </div> -->
      </div>
    </div>
    <!-- <div v-else>
      Must be a BUG!
    </div> -->
  </div>
</template>

<script>
import store from '@/store'
import * as constants from '@/utils/constants'
export default {
  methods: {
    blur () {
      // console.log(this.$refs.nameInput.value)
      if (this.$refs.nameInput.value.length > 0) {
        let value = this.$refs.nameInput.value !== '$$RENAME$$' ? this.$refs.nameInput.value : 'No Name'
        this.$bus.$emit('folderRename', [this.currentFolder.id, value])
      }
    }
  },
  computed: {
    currentFolder () {
      switch (store.state.App.selectedFolder) {
        case constants.fixedFolderID.recent:
          return {
            name: 'Recent',
            fixed: true,
            imagesCount: 0,
            size: 0
          }
        default:
          let imagesCount = 0
          let size = 0
          if (store.state.App.image2FolderMap[store.state.App.selectedFolder]) {
            imagesCount = store.state.App.image2FolderMap[store.state.App.selectedFolder].length
            store.state.App.image2FolderMap[store.state.App.selectedFolder].forEach(image => {
              size += image.size
            })
            let kbSize = (size / 1024)
            if (kbSize < 1024) {
              size = kbSize.toFixed(3) + ' KB'
            } else {
              size = (kbSize / 1024).toFixed(3) + ' MB'
            }
          }
          let name = ''
          let fixed = true
          switch (store.state.App.selectedFolder) {
            case constants.fixedFolderID.trash:
              name = 'Trash'
              break
            case constants.fixedFolderID.all:
              name = 'All'
              break
            default:
              name = store.state.App.folderMap[store.state.App.selectedFolder].name
              fixed = false
              break
          }
          return {
            id: store.state.App.selectedFolder,
            name,
            imagesCount,
            size,
            fixed
          }
      }
    }
  }
}
</script>

<style lang="scss">

.right-folder {
  color: white;
  .name-input {
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
    margin-top: 16px;
    border: 1px solid transparent;
    transition: all 0.5s;
    &:focus {
      border: 1px solid rgb(49, 141, 226);
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
  .title {
    color: white;
    font-size: 13px;
    margin-top: 32px;
    margin-left: 16px;
    margin-bottom: 12px;
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
