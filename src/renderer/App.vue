<template>
  <div id="app" >
    <welcome v-if="!libraryLoaded" :createLibrary="displayCreateLibrary"></welcome>
    <Major v-else></Major>
    <Setting v-if="displaySetting"></Setting>
  </div>
</template>

<script>
import Welcome from '@/components/Welcome/Welcome'
import Major from '@/components/Major/Major'
import Setting from '@/components/Settings/Setting'
import * as utils from '@/utils'
import store from '@/store'
import { mapState } from 'vuex'
import { ipcRenderer, remote } from 'electron'
// import _ from 'lodash'

ipcRenderer.on('ui-create-library', (event, args) => {
  if (args == null) {
    // create Library
    remote.getCurrentWindow().setResizable(false)
    setTimeout(() => {
      store.dispatch('displayCreateLibrary')
    }, 500)
  }
})
ipcRenderer.on('ui-library-loaded', (events, args) => {
  setTimeout(() => {
    store.commit('SET_LIBRARY_PATH', args.libraryDir)
    store.commit('SET_IMAGES', args.images)
    utils.folderWalker(args.folders, (item) => {
      item.type = 'folder'
      item.count = 0
    })
    store.commit('SET_FOLDERS', args.folders)
    store.dispatch('libraryLoaded')
    remote.getCurrentWindow().setResizable(true)
    remote.getCurrentWindow().setSize(1320, 780, true)
    // remote.getCurrentWindow().focus()
    remote.getCurrentWindow().flashFrame(true)
    // remote.getCurrentWindow().center()
    ipcRenderer.send('bg-start-palette')
    store.commit('SET_PALETTE_PROCESS_STATUS', true)
  }, 100)
})
ipcRenderer.on('ui-image-loaded', (event, args) => {
  store.commit('INCREASE_FILE_PROCESSED_COUNT', args)
})
ipcRenderer.on('ui-palette-queue-length', (event, args) => {
  store.commit('SET_PALETTE_QUEUE_LENGTH', args)
})
ipcRenderer.on('ui-update-image', (event, meta) => {
  store.commit('UPDATE_IMAGE', meta)
  const id = '#item-' + meta.id
  const title = id + ' .title'
  const q = $(title)
  if (q && q[0]) {
    $(q[0]).text(meta.name)
  }
})
export default {
  name: 'sparrow',
  components: {
    Welcome,
    Major,
    Setting
  },
  computed: mapState({
    displayCreateLibrary: state => state.App.displayCreateLibrary,
    libraryLoaded: state => state.App.libraryLoaded,
    displaySetting: state => state.App.displaySetting
  })
}
</script>

<style lang="scss">

body {
  padding: 0;
  margin: 0;
  height: 100vh;
  background-color: #333333;
  user-select: none;
  overflow: hidden;
}
.app{
  position: relative;
  overflow: hidden;
}
.vue-slider-component .vue-slider-process{
  background-color:rgb(49, 141, 226) !important;
}
.vue-slider-dot-handle{
  box-sizing: border-box !important;
  border: 5px solid white !important;
  background-color: rgb(49, 141, 226) !important;
}
.search-in-input {
  background: url(/static/svg/search.svg) center no-repeat ;
  background-size: 14px;
  position: absolute;
  pointer-events: none;
}
.sep{
  width: 1px;
  height: 12px;
  background-color: #282828;
  margin: 0 2px;
}
</style>
