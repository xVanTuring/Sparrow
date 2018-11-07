import { fixedFolderID } from '../../utils/constants'
import * as utils from '@/utils'
import _ from 'lodash'
const state = {
  displayCreateLibrary: false,
  libraryLoaded: false,
  libraryPath: '',
  language: 'en',
  majorColor: 'rgb(49, 141, 226)',
  zoomLevel: 1.5,
  ctrl: false,
  selectedFolder: fixedFolderID.all,
  selectedSubFolder: '',
  folders: [],
  folderMap: {},
  images: [],
  filteredImages: [],
  ImageDragging: false,
  displaySetting: false,
  selectedImageIds: [],
  fileProcessQueueLength: 0,
  fileProcessedCount: 0,
  image2FolderMap: {},
  imageMap: {},
  tags: [],
  filterWord: '',
  backSelectImages: []
}
const mutations = {
  SET_FILTER_WORD (state, word) {
    state.filterWord = word
    state.filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
  },
  SET_SELECTED_SUB_FOLDER (state, id) {
    state.selectedSubFolder = id
  },
  SET_FILE_PROCESS_QUEUE_LENGTH (state, length) {
    state.fileProcessQueueLength = length
  },
  INCREASE_FILE_PROCESSED_COUNT (state) {
    state.fileProcessedCount++
  },
  RESET_QUEUE_COUNT (state) {
    state.fileProcessQueueLength = 0
    state.fileProcessedCount = 0
  },
  SET_SELECTED_IMAGE_IDS (state, ids) {
    state.backSelectImages = _.clone(state.selectedImageIds)
    state.selectedImageIds = ids
  },
  DISPLAY_CREATE_LIBRARY (state) {
    state.displayCreateLibrary = true
  },
  LIBRARY_LOADED (state) {
    state.libraryLoaded = true
    refreshImage2FolderMap(state)
  },
  SET_LANGUAGE (state, lang) {
    state.language = lang
  },
  SET_MAJOR_COLOR (state, color) {
    state.majorColor = color
  },
  SET_ZOOM_LEVEL (state, zoom) {
    state.zoomLevel = zoom
  },
  SET_CTRL_STATUS (state, ctrl) {
    state.ctrl = ctrl
  },
  SET_SELECTED_FOLDER (state, folderId) {
    if (state.selectedFolder !== folderId) {
      state.selectedFolder = folderId
      state.filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    }
  },
  SET_FOLDERS (state, folders) {
    state.folders = folders
    const map = {}
    utils.folderWalker(folders, function (item) {
      map[item.id] = item
    })
    state.folderMap = map
  },
  SET_IMAGES (state, images) {
    state.images = images
    state.filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    ImageBind(state)
  },
  ADD_IMAGE (state, image) {
    const cloned = _.clone(state.images)
    cloned.push(image)
    state.images = cloned
    state.filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    refreshImage2FolderMap(state)
    ImageBind(state)
  },
  UPDATE_IMAGE (state, image) {
    for (let i = 0; i < state.images.length; i++) {
      if (state.images[i].id === image.id) {
        state.images[i] = image
        break
      }
    }
    for (let i = 0; i < state.filteredImages.length; i++) {
      if (state.filteredImages[i].id === image.id) {
        state.filteredImages[i] = image
        break
      }
    }
    refreshImage2FolderMap(state)
    ImageBind(state)
  },
  SET_LIBRARY_PATH (state, path) {
    state.libraryPath = path
  },
  SET_IMAGE_DRAGGING (state, dragging) {
    state.ImageDragging = dragging
  },
  SET_DESIPLAY_SETTING (state, bool) {
    state.displaySetting = bool
  }
}
const actions = {
  displayCreateLibrary ({ commit }) {
    commit('DISPLAY_CREATE_LIBRARY')
  },
  libraryLoaded ({ commit }) {
    commit('LIBRARY_LOADED')
  },
  toEnglish ({ commit }) {
    commit('SET_LANGUAGE', 'en')
  },
  toChinese ({ commit }) {
    commit('SET_LANGUAGE', 'zh-cn')
  },
  toKorea ({ commit }) {
    commit('SET_LANGUAGE', 'kr')
  },
  setMajorColor (contex, color) {
    contex.commit('SET_MAJOR_COLOR', color)
  },
  setZoomLevel (contex, zoomLevel) {
    contex.commit('SET_ZOOM_LEVEL', zoomLevel)
  },
  setCtrlStatus (contex, ctrl) {
    contex.commit('SET_CTRL_STATUS', ctrl)
  },
  setSelectedFolder (contex, id) {
    contex.commit('SET_SELECTED_FOLDER', id)
  }
}
export default {
  state,
  mutations,
  actions
}
/**
 *
 * @param {{id:string,isDeleted:boolean}[]} allImages
 * @param {string} folderId
 * @param {string} filterWord
 * @param {number[]} filterColor
 * @param {boolean}  filterOri
 * @param {number[]} filterSize
 */
const filter = (allImages, folderId, filterWord, filterColor, filterOri, filterSize) => {
  // filterWord search name tag des
  return allImages.filter((img) => {
    let result = true
    switch (folderId) {
      case fixedFolderID.all:
        result = !img.isDeleted
        break
      case fixedFolderID.trash:
        result = img.isDeleted
        break
      default:
        result = img.folders.indexOf(folderId) !== -1 && !img.isDeleted
        break
    }
    if (result && filterWord && filterWord !== '') {
      const filterWordArr = filterWord.split(' ')
      result = filterWordArr.every(item => {
        return img.name.toLowerCase().indexOf(item.toLowerCase()) !== -1 || img.tags.toLowerCase().indexOf(item.toLowerCase()) !== -1
      })
    }
    return result
  })
}
const refreshImage2FolderMap = (state) => {
  const image2FolderMap = {}
  image2FolderMap[fixedFolderID.trash] = []
  image2FolderMap[fixedFolderID.all] = []
  state.images.forEach(image => {
    if (image.isDeleted) {
      image2FolderMap[fixedFolderID.trash].push(image)
    } else {
      image2FolderMap[fixedFolderID.all].push(image)
      if (image.folders && image.folders.length > 0) {
        image.folders.forEach(folderId => {
          if (image2FolderMap[folderId]) {
            image2FolderMap[folderId].push(image)
          } else {
            image2FolderMap[folderId] = [image]
          }
        })
      }
    }
  })
  state.image2FolderMap = image2FolderMap
}
function ImageBind (state) {
  const imageMap = {}
  let tags = []
  // extract to method
  state.images.forEach(image => {
    imageMap[image.id] = image
    tags = tags.concat(image.tags)
  })
  state.tags = Array.from(new Set(tags))
  state.imageMap = imageMap
}
