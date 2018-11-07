<template>
  <div class="left-root">
    <div class="left-top-container focus">
      <Traffic/>
    </div>
    <div class="fixed-folders">
      <!-- Fixed -->
      <FolderItem type="all" :selected="'$$all$$'===selectedFolder" :count="image2FolderMap['$$all$$'].length" title="All" @click.native="folderClick('$$all$$')"></FolderItem>
      <FolderItem type="recent" :selected="'$$recent$$'===selectedFolder" title="Recent" @click.native="folderClick('$$recent$$')"></FolderItem>
      <FolderItem id="$$trash$$" type="trash" :selected="'$$trash$$'===selectedFolder" :count="image2FolderMap['$$trash$$'].length"  title="Trash" @click.native="folderClick('$$trash$$')"></FolderItem>
    </div>
    <div class="folders-title">
      <div>Folders</div>
      <IconAdd class="add" @click.native="addFolderClick" baseColor="rgb(145, 145, 145)"></IconAdd>
    </div>
    <!-- cross-tree -->
    <div class="scroll-bar">
      <DraggableTree :data="filterWord.length>0?filteredFolders:folders" 
        :draggable="filterWord.length===0" cross-tree="true" @change="treeChange" ref="dtree"  >
        <div slot-scope="{data, store}">
          <template v-if="!data.isDragPlaceHolder">
              <FolderItem 
                @folderRename="folderRename"
                :type="data.type" 
                :extra="{data,store}" 
                :open="data.open" 
                :childCount="data.children.length" 
                :title="data.name" 
                :count="image2FolderMap[data.id]?image2FolderMap[data.id].length:0" 
                :selected="data.id===selectedFolder" 
                :id="data.id" @click.native="folderClick(data.id,data,store)"></FolderItem>
          </template>
        </div>
      </DraggableTree>
    </div>
    <div class="search-box">
      <input class="search-input" placeholder="Search" v-model="filterWord"/>
      <img src="@/assets/svgs/search.svg"/>
    </div>
    </div>
</template>

<script>
import FolderItem from './Sub/FolderItem'
import Traffic from './Sub/Traffic'
import IconAdd from './Sub/IconAdd'
import IconImport from './Sub/IconImport'
import _ from 'lodash'
import uuid from 'uuid/v4'
import store from '@/store'
import { DraggableTree } from 'vue-draggable-nested-tree'
import ScrollBar from 'vue2-scrollbar'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import * as utils from '@/utils'
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      folders: _.cloneDeep(store.state.App.folders),
      filteredFolders: [],
      filterWord: ''
    }
  },
  computed: {
    selectedFolder () {
      return store.state.App.selectedFolder
    },
    image2FolderMap () {
      return store.state.App.image2FolderMap
    }
  },
  components: {
    FolderItem,
    DraggableTree,
    IconAdd,
    IconImport,
    VuePerfectScrollbar,
    ScrollBar,
    Traffic
  },
  methods: {
    folderClick (id, data, _store) {
      if (data && data.name === '$$RENAME$$') {
        return
      }
      store.dispatch('setSelectedFolder', id)
      store.commit('SET_SELECTED_IMAGE_IDS', [])
      store.commit('SET_SELECTED_SUB_FOLDER', '')
    },
    addFolderClick () {
      // TODO: bug first add folder take long time
      let data = {
        id: uuid(),
        name: '$$RENAME$$',
        count: 0,
        type: 'folder'
      }
      this.folders.unshift(data)
    },
    treeChange (node, targetTree, oldTree) {
      console.log('Change')
      store.commit('SET_FOLDERS', this.$refs.dtree.getPureData())
      ipcRenderer.send('bg-save-library-config', { folders: this.$refs.dtree.getPureData() })
    },
    folderRename ([id, name]) {
      utils.folderFinder(this.folders, id, (folder) => {
        folder.name = name
      })
      store.commit('SET_FOLDERS', this.$refs.dtree.getPureData())
      store.commit('SET_SELECTED_FOLDER', id)
      ipcRenderer.send('bg-save-library-config', { folders: this.$refs.dtree.getPureData() })
    }
  },
  created () {
    this.$bus.$on('folderRename', this.folderRename)
  },
  beforeDestroy () {
    this.$bus.$off('folderRename', this.folderRename)
  },
  watch: {
    filterWord: function (newV) {
      // TODO: better search + animation
      let tmp = []
      let cloned = _.cloneDeep(this.$refs.dtree.getPureData())
      utils.folderWalker(cloned, (folder) => {
        let subWord = newV.split(' ')
        for (let i = 0; i < subWord.length; i++) {
          if (folder.name.toLowerCase().indexOf(subWord[i].toLowerCase()) !== -1) {
            tmp.push(folder)
            break
          }
        }
      })
      tmp.forEach((folder) => {
        delete folder.children
      })
      this.filteredFolders = tmp
    }
  }
}
</script>

<style lang="scss">
.left-root {
  position: absolute;
  width: 230px;
  left: 0;
  top: 0;
  bottom: 40px;
  border-right: 1px solid #282828;
  box-sizing: border-box;
}
.left-top-container {
  -webkit-app-region: drag;
  height: 40px;
  border-bottom: 1px solid #282828;
  line-height: 40px;
  color: white;
  padding-left: 8px;
  font-size: 14px;
  box-sizing: border-box;
  .title {
    float: right;
    margin-right: 16px;
    // display: inline-block;
  }
}
.search-box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8px;
  .search-input {
    display: block;
    outline: none;
    border: 0px;
    width: calc(100% - 46px);
    margin: auto;
    border-radius: 2px;
    font-size: 12px;
    height: 20px;
    padding-left: 8px;
    padding-right: 22px;
    background-color: rgb(39, 39, 39);
    color: white;
    border: 1px solid transparent;
    transition: all 0.5s;
    &:focus {
      border: 1px solid rgb(49, 141, 226);
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
  img {
    height: 14px;
    position: absolute;
    right: 12px;
    bottom: 5px;
  }
}
.folders-title {
  height: 18px;
  margin-top: 4px;
  :nth-child(1) {
    color: #cacaca;
    font-size: 14px;
    padding-left: 8px;
    line-height: 18px;
    float: left;
    cursor: default;
  }
  .add {
    float: right;
    height: 18px;
    margin-right: 4px;
    cursor: pointer;
    opacity: 0;
  }
  &:hover {
    .add {
      opacity: 1;
    }
  }
  .hide {
    margin-right: 8px;
    float: right;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    color: rgb(145, 145, 145);
    margin-top: 2px;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
}
.scroll-bar {
  // height: 300px;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  position: absolute;
  top: 180px;
  bottom: 38px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #535353;
  }
}

.draggable-placeholder-inner {
  border: 1px dashed rgb(49, 141, 226);
  box-sizing: border-box;
  background: rgba(rgb(49, 141, 226), 0.09);
  padding: 0;
}

.tree-node-inner-back {
  margin-bottom: 0px !important;
}
</style>
