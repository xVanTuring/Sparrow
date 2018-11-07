<template>
<div id="welcome">
  <transition name="opacity-trans">
    <div v-if="createLibrary" id="close">
      <img src="@/assets/close-2.svg" />
    </div>
  </transition>
  <!-- TODO: use svg and animation -->
  <transition name="opacity-trans">
    <div v-show="createLibrary" class="switch-lbrary" @click="toggleImport">
      <!-- <img :src="switchLibraryIcon" /> -->
      <IconImport height="16" width="16" :isImport="!openExistsLibrary"></IconImport>
      <div class="switch-title">
        {{switchLibraryCentent}}
      </div>
    </div>
  </transition>
  <transition name="opacity-trans">
    <country-selection v-if="createLibrary" class="country-selection-wrapper" />
  </transition>
  <img :class="{logo:true,'create-library':createLibrary,'open-library':openExistsLibrary}" src="@/assets/icon_512.png" />
  <transition name="opacity-trans">
    <div v-if="createLibrary" :class="{'create-library-form':true,'open-library-form':openExistsLibrary}">
      <transition name="height-trans">
        <div v-if="!openExistsLibrary" class="input-container">
          <div class="title-wrapper">
            <transition name="title-fade">
              <label v-show="pathIlleagle||displayTPath">{{$t(pathTitleCode)}}</label>
            </transition>
          </div>
          <div class="input-wrapper">
            <input ref="pathInput" v-model="libraryPath" v-bind:class="{'illeagle-path':pathIlleagle}" @input="libraryInputChange" @focus="togglePathDisplay"
              @blur="togglePathDisplay" />
            <div class="select-path-wrapper" @click="pathClick" @mousedown="toggleClickState(true,true)" @mouseup="toggleClickState(true,false)"
              @mouseout="toggleClickState(true,false)" v-bind:class="{clicked:openClicking}">
              <img class="select-path" src="@/assets/folder.svg" />
              <div class="btn-mask"></div>
            </div>
          </div>
        </div>
      </transition>
      
      <div>
        <div class="title-wrapper">
          <transition name="title-fade">
            <label v-show="nameIlleagle||displayNPath||openExistsLibrary">{{$t(nameTitleCode)}}</label>
          </transition>
        </div>
        <div class="input-wrapper">
          <div
            @click="openLibrary"
          >
            <input ref="nameInput" 
              :disabled="openExistsLibrary"
              v-model="libraryName"
              :placeholder="nameInputPlaceHolder"
              :class="{'illeagle-name':nameIlleagle}" @focus="toggleNameDisplay" @blur="toggleNameDisplay"
              @input="libraryInputChange" />
          </div>
          <div  
            @mousedown="toggleClickState(false,true)" @mouseup="toggleClickState(false,false)" @mouseout="toggleClickState(false,false)"
            @click="next" 
            :class="{'next-wrapper':true,clicked:nextClicking,disabled:pathIlleagle||nameIlleagle||wrongExistLibrary}">
            <img class="next-btn" src="@/assets/icon-next.svg" />
            <div class="btn-mask"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  
  <div v-if="!createLibrary" class="spinner" >
  </div>
</div>
</template>
<script>
// TODO: if open exists library background will display the imgs
// TODO: custom label content
import CountrySelection from '@/components/Welcome/CountrySelection'
import IconImport from '../Major/Sub/IconImport'
import os from 'os'
import path from 'path'
import fs from 'fs'

let defaultPath = os.homedir()
const picPath = path.join(defaultPath, 'Pictures')
if (fs.existsSync(picPath)) {
  defaultPath = picPath
}
export default {
  components: {
    CountrySelection,
    IconImport
  },
  props: {
    createLibrary: Boolean
  },
  data () {
    return {
      libraryPath: defaultPath,
      libraryName: 'Sparrow',
      tmpName: 'Sparrow',
      tmpPath: '',
      openClicking: false,
      nextClicking: false,
      displayTPath: false,
      displayNPath: false,
      pathIlleagle: false,
      nameIlleagle: false,

      openExistsLibrary: false,
      nameTitleCode: 'i18n.libraryName',
      pathTitleCode: 'i18n.libraryPath',
      nameInputPlaceHolder: '',
      wrongExistLibrary: false,
      nextClicked: false,

      switchLibraryIcon: '/static/svg/import.svg',
      switchLibraryCentent: 'Open Library'
    }
  },
  methods: {
    toggleClickState: function (isOpen, state) {
      if (isOpen) {
        this.openClicking = state
      } else {
        this.nextClicking = state
      }
    },
    nextDown: function (arg) {
      if (arg) {
        this.openClicking = true
      } else {
        this.nextClicking = true
      }
    },
    nextUp: function (arg) {
      if (arg) {
        this.openClicking = false
      } else {
        this.nextClicking = false
      }
    },
    next: function (arg) {
      if (!this.pathIlleagle && !this.nameIlleagle) {
        if (this.nextClicked) {
          return
        }
        this.nextClicked = true
        if (!this.openExistsLibrary) {
          this.$electron.ipcRenderer.send('bg-create-library', [this.libraryPath, this.libraryName])
        }
      }
    },
    pathClick: function () {
      if (this.nextClicked) {
        return
      }
      let defaultPath = this.libraryPath
      const picPath = path.join(defaultPath, 'Pictures')
      if (fs.existsSync(picPath)) {
        defaultPath = picPath
      }
      this.$electron.remote.dialog.showOpenDialog({
        title: 'Select Folder',
        defaultPath: defaultPath,
        properties: ['openDirectory']
      }, files => {
        if (files) {
          this.libraryPath = files[0]
        }
      })
    },
    libraryInputChange: function () {
      if (this.openExistsLibrary) {
        if (this.libraryName === '') {
          this.nameIlleagle = true
          this.nameTitleCode = 'i18n.wrongLibraryPath'
        } else if (path.basename(this.libraryName) !== 'library.json') {
          this.nameIlleagle = true
          this.nameTitleCode = 'i18n.wrongLibraryPath'
        } else {
          fs.readFile(this.libraryName, (err, file) => {
            if (err) {
              this.nameIlleagle = true
              this.nameTitleCode = 'i18n.wrongLibraryPath'
            } else {
              if (JSON.parse(file.toString()).app && JSON.parse(file.toString()).app === 'Sparrow') {
                this.nameIlleagle = false
                this.nameTitleCode = 'i18n.libraryPath'
              } else {
                this.nameIlleagle = true
                this.nameTitleCode = 'i18n.wrongLibraryPath'
              }
            }
          })
        }

        return
      }
      let that = this
      if (this.libraryPath === '') {
        this.pathIlleagle = true
        this.pathTitleCode = 'i18n.emptyLibraryPath'
      } else {
        fs.access(this.libraryPath, fs.constants.W_OK, function (err) {
          if (err) {
            that.pathIlleagle = true
            that.pathTitleCode = 'i18n.wrongPath'
          } else {
            that.pathIlleagle = false
            that.pathTitleCode = 'i18n.libraryPath'
          }
        })
      }

      let fileReg = /[/\\`]+/g
      const fullPath = path.join(this.libraryPath, this.libraryName)
      if (this.libraryName === '') {
        that.nameTitleCode = 'i18n.emptyLibraryName'
        this.nameIlleagle = true
      } else if (fileReg.test(this.libraryName)) {
        that.nameTitleCode = 'i18n.wrongLibraryName'
        this.nameIlleagle = true
      } else if (fs.existsSync(fullPath)) {
        that.nameTitleCode = 'i18n.libraryNameExists'
        this.nameIlleagle = true
      } else {
        this.nameIlleagle = false
        that.nameTitleCode = 'i18n.libraryName'
      }
    },
    togglePathDisplay () {
      this.displayTPath = !this.displayTPath
    },
    toggleNameDisplay () {
      this.displayNPath = !this.displayNPath
    },
    toggleImport () {
      if (this.nextClicked) {
        return
      }
      this.openExistsLibrary = !this.openExistsLibrary
      if (this.openExistsLibrary) {
        this.tmpName = this.libraryName
        this.libraryName = this.tmpPath
        this.nameInputPlaceHolder = 'Click to Select metadata.json'
        this.libraryInputChange()

        this.switchLibraryIcon = '/static/svg/export.svg'
        this.switchLibraryCentent = 'Create Library'
      } else {
        this.nameInputPlaceHolder = ''
        this.tmpPath = this.libraryName
        this.libraryName = this.tmpName
        this.libraryInputChange()

        this.switchLibraryIcon = '/static/svg/import.svg'
        this.switchLibraryCentent = 'Open Library'
      }
    },
    openLibrary () {
      if (this.nextClicked) {
        return
      }
      if (this.openExistsLibrary) {
        this.$electron.remote.dialog.showOpenDialog({
          title: 'Select library.json File',
          defaultPath: defaultPath,
          filters: [{name: 'Library', extensions: ['json']}],
          properties: ['openFile']
        }, files => {
          if (files) {
            this.libraryName = files[0]
            // check
            this.libraryInputChange()
          }
        })
      }
    }
  },
  computed: {
    majorColor () {
      return this.$store.state.App.majorColor
    }
  },
  watch: {
    createLibrary: function (newV) {
      if (newV) {
        this.libraryInputChange()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/globals.scss';
// layout
@keyframes opacityin {
  0%{opacity: 0; }
  100%{opacity: 1;}
}
@keyframes spin {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
#welcome {
  background-color: #353535;
  // background: url(/static/svg/trianglify.svg) center no-repeat ;
  height: 100vh;
  position: relative;
  user-select: none;
  -webkit-app-region: drag;
  div{
      -webkit-app-region: no-drag;
  }
  overflow: hidden;
}
.logo {
  display: block;
  height: 100px;
  margin: auto;
  margin-top: calc(50vh - 50px);
  transition-duration: .3s;
  transition-timing-function: ease;
  opacity: 0;
  animation: opacityin .3s ease .3s forwards;
}
.logo.create-library{
  margin-top: 100px;
}
.logo.open-library{
  margin-top: 160px;
}
.spinner {
  margin: auto;
  margin-top: 60px;
  height: 30px;
  width: 30px;
  border: 3px solid rgba(121, 121, 121, 0.15);
  border-radius: 50%;
  border-left-color: $primary;
  opacity: 0;
  animation:opacityin .3s ease .5s forwards, spin .6s linear infinite;
}
.create-library-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150px;
  transition: all .3s;
}
.create-library-form.open-library-form{
  margin-top: 80px;
}
.country-selection-wrapper {
  position: absolute;
  left: 0px;
  bottom: 0px;
  padding: 8px;
}
.switch-lbrary{
  position: absolute;
  display: flex;
  top: 4px;
  left: 4px;
  // width: 150px;
  padding: 4px;
  align-items: center;
  cursor: pointer;
  .switch-title{
    color: rgb(204, 204, 204);
    font-size: 12px;
    margin-left: 4px;
    max-width: 0;
    max-height: 0;
    opacity: 0;
    transition: max-width .2s,opacity .3s;
    overflow: hidden;
  }
  &:hover{
    background-color: rgba(75, 75, 75, 0.658);
    .switch-title{
      max-width: 100px;
      opacity: 1;
      max-height: 13px;
    }
  }
}


#close {
  position: absolute;
  padding: 4px;
  right: 4px;
  top: 4px;
  img {
  display: block;
  width: 12px;
  height: 12px;
  }
  &:hover {
    background-color: rgb(216, 35, 35);
  }
}
.input-container{
  height: 52px;
  overflow: hidden;
}



/* Trans*/

.title-fade-enter-active,.title-fade-leave-active {
  transition: all .3s ease;
}
.title-fade-enter, .title-fade-leave-to {
  opacity: 0;
  margin-left: -10px;
}
.opacity-trans-enter-active,.opacity-trans-leave-active{
  transition: all .3s;
}
.opacity-trans-enter,.opacity-trans-leave-to{
  opacity: 0;
}
.height-trans-enter-active,.height-trans-leave-active{
  transition: height .3s ease;
}
.height-trans-enter,.height-trans-leave-to{
  height: 0;
}
</style>

<style lang="scss" scoped>
/* detail */
@import '@/globals.scss';


::selection {
  color: rgb(189, 189, 189);
  background-color: rgb(97, 97, 97);
}
.title-wrapper {
  height: 16px;
  margin-bottom: 2px;
  margin-left:4px;
  label {
    color: rgb(133, 133, 133);
    font-size: 12px;
  }
}
input {
  width: 220px;
  line-height: 16px;
  padding: 8px 0;
  color: white;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #404040;
  border-radius: 2px;
  cursor: text;
  outline: none;
  border: 1px solid transparent;
  box-sizing: border-box;
  margin-right: 8px;
  transition: border-color .3s ease;
  
}
input:disabled {
  cursor:pointer;
}
input.illeagle-path {
  border: 1px solid #FF3838;
}

input.illeagle-name {
  border: 1px solid #EADF48;
}
.select-path-wrapper, .next-wrapper {
  background-color: rgb(49, 141, 226);
  border-radius: 4px;
  cursor: pointer;
  height: 34px;
  width: 34px;
  position: relative;
  overflow: hidden;
  display: flex;
}

.select-path-wrapper.clicked .btn-mask {
  background-color: rgba(75, 75, 75, 0.28);
}

.next-wrapper.disabled {
  background-color: rgb(122, 122, 122);
  cursor: not-allowed;
}

.next-wrapper.clicked .btn-mask {
  background-color: rgba(75, 75, 75, 0.28);
}

.next-wrapper.disabled .btn-mask {
  background-color: rgba(43, 43, 43, 0.534);
}
.input-wrapper {
  display: flex;
}

.btn-mask {
  left: 0;
  top: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  transition:all .3s;
}

.select-path, .next-btn {
  margin: auto;
  width: 14px;
  height: 14px;
  vertical-align: bottom;
}

.select-path {
  width: 20px;
  height: 20px;
}

</style>