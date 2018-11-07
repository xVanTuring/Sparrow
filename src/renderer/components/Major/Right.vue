<template>
  <div class="right-root">
    <div class="top-area">
      <div class="info-title" :class="{activated:showFolderTab||selectedImageIds.length===0}" @click="toggle(true)">
        Folder
      </div>
      <div class="sep"></div>
      <div class="info-title" :class="{activated:(!showFolderTab&&selectedImageIds.length>0)}" @click="toggle(false)">
        Image
      </div>
    </div>
    <RightImage v-if="!showFolderTab&&selectedImageIds.length>0"></RightImage>
    <RightFolder v-else></RightFolder>

  </div>
</template>

<script>
import IconClose from './Sub/IconClose'
import store from '../../store'
import RightImage from './Sub/RightImage'
import RightFolder from './Sub/RightFolder'
import { mapState } from 'vuex'
export default {
  components: {
    IconClose,
    RightImage,
    RightFolder
  },
  computed: {
    ...mapState({
      showFolderTab: state => state.Right.showFolderTab,
      selectedImageIds: state => state.App.selectedImageIds
    })
  },
  methods: {
    toggle (bool) {
      store.commit(bool ? 'SHOW_FOLDER_TAB' : 'SHOW_IMAGE_TAB')
    }
  }
}
</script>

<style lang="scss">

.right-root {
  width: 230px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 40px;
  box-sizing: border-box;
  border-left: 1px solid #282828;
  // overflow: hidden;
  .close-wrapper {
    -webkit-app-region: no-drag;
    width: 32px;
    height: 32px;
    position: absolute;
    right: 4px;
    top: 4px;
    &:hover {
      background-color: rgba(82, 82, 82, 0.521);
    }
    .close-icon {
      margin: 4px;
    }
  }
  .top-area {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #282828;
    box-sizing: border-box;
    -webkit-app-region: drag;
    .sep {
      margin: 0 32px;
    }
    .info-title {
      text-align: center;
      width: 60px;
      height: 100%;
      line-height: 40px;
      color: rgb(136, 136, 136);
      font-size: 90%;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
    .activated {
      color: white;
    }
  }
}
</style>
