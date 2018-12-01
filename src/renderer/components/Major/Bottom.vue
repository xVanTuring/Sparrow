<template>
  <div class="bottom-root">
    <div class="progress progress-movement">
    </div>
    <div class="setting-wrapper">
      <img src="@/assets/svgs/gear-o.svg"/>
    </div>
    <div class="bottom-info" v-if="selectedImageIds.length>0 && fileProcessQueueLength===0">
      <div class="info">Selected: {{selectedImageIds.length}}</div>
      <div class="sep"></div>
      <div class="info"> Total: {{selectedImageSize}}</div>
      <div class="sep"></div>
      <div class="info"> Format: {{selectedImageFomat}}</div>
    </div>
    <div class="bottom-info progress-info">
        {{fileProcessQueueLength===0?'Updating Index':`Processing: ${fileProcessedCount}/${fileProcessQueueLength}`}}
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { ipcRenderer } from 'electron'
export default {
  computed: {
    selectedImageIds () {
      return store.state.App.selectedImageIds
    },
    selectedImageItem () {
      let filtered = store.state.App.images.filter((image) => {
        return this.selectedImageIds.indexOf(image.id) !== -1
      })
      return filtered
    },
    selectedImageSize () {
      let kbSize = (this.selectedImageItem.reduce((prev, img) => {
        return prev + img.size
      }, 1) / 1024)
      if (kbSize < 1024) {
        return kbSize.toFixed(3) + ' KB'
      }
      return (kbSize / 1024).toFixed(3) + ' MB'
    },
    selectedImageFomat () {
      let formats = this.selectedImageItem.map((item) => {
        return item.ext.toUpperCase()
      })

      return Array.from(new Set(formats)).join(' ')
    },
    fileProcessQueueLength () {
      return store.state.App.fileProcessQueueLength
    },
    fileProcessedCount () {
      return store.state.App.fileProcessedCount
    }
  },
  watch: {
    fileProcessedCount (newV) {
      if (this.fileProcessQueueLength !== 0 && this.fileProcessedCount !== 0) {
        $('.progress-info').css({
          opacity: 1,
          visibility: 'visible'
        })
        $('.progress').css({
          width: parseInt(this.fileProcessedCount / this.fileProcessQueueLength * 100) + '%',
          opacity: 1
        })
        if (this.fileProcessQueueLength <= this.fileProcessedCount) {
          setTimeout(() => {
            store.commit('RESET_QUEUE_COUNT')
            ipcRenderer.send('bg-start-palette')
          }, 300)
        }
      } else {
        $('.progress').css({
          opacity: 0
        })
        $('.progress-info').css({
          opacity: 0,
          visibility: 'collapse'
        })
        setTimeout(() => {
          $('.progress').css({
            width: 0
          })
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss">
.bottom-root {
  color: white;
  height: 40px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid #282828;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .progress {
    width: 0%;
    height: 100%;
    background-color: rgb(49, 141, 226);
    position: absolute;
    left: 0;
    transition: width .2s, opacity .3s;
  }
  .setting-wrapper {
    position: absolute;
    left: 4px;
    width: 26px;
    height: 26px;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background-color: #404040;
    }
    img {
      display: block;
      width: 20px;
      // margin: auto;
    }
  }
  .bottom-info {
    color: #c2c2c2;
    font-size: 80%;
    display: flex;
    &.progress-info {
      z-index: 1000;
      color: white;
      visibility: collapse;
    }
    .sep {
      margin: 0 12px;
    }
  }
}
@keyframes progress-bar-stripes {
  from {
    background-position: 60px 0;
  }
  to {
    background-position: 0 0;
  }
}
.progress-movement {
  // vue blu
  background-image: linear-gradient(
    45deg,
    hsla(0, 0%, 100%, 0.15) 25%,
    transparent 0,
    transparent 50%,
    hsla(0, 0%, 100%, 0.15) 0,
    hsla(0, 0%, 100%, 0.15) 75%,
    transparent 0,
    transparent
  );
  background-size: 60px 60px;
  animation: progress-bar-stripes 1s linear infinite;
}
</style>
