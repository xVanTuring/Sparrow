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
  displaySetting: false,
  selectedImageIds: [],
  fileProcessQueueLength: 0,
  fileProcessedCount: 0,
  fileProcessedArray: [],
  image2FolderMap: {},
  imageMap: {},
  tags: [],
  filterWord: '',
  backSelectImages: [],
  imageSortType: 1,
  paletteProcessStatus: false,
  paletteQueueLength: 0,
  layoutType: 0
}
const mutations = {
  SET_LAYOUT_TYPE (state, value) {
    state.layoutType = value
  },
  SET_FILTER_WORD (state, word) {
    state.filterWord = word
    const filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    const oldImageIds = state.filteredImages.map(item => {
      return item.id
    })
    const newImageIds = filteredImages.map(item => {
      return item.id
    })
    if (!sameStrArr(oldImageIds, newImageIds)) {
      state.filteredImages = sortImages(filteredImages, state.imageSortType)
    }
  },
  SET_SELECTED_SUB_FOLDER (state, id) {
    state.selectedSubFolder = id
  },
  SET_FILE_PROCESS_QUEUE_LENGTH (state, length) {
    state.fileProcessQueueLength = length
  },
  INCREASE_FILE_PROCESSED_COUNT (state, image) {
    state.fileProcessedCount++
    state.fileProcessedArray.push(image)
  },
  RESET_QUEUE_COUNT (state) {
    state.fileProcessQueueLength = 0
    state.fileProcessedCount = 0
    // todo: auto append very 20
    if (state.fileProcessedArray.length > 0) {
      let cloned = state.images.concat(state.fileProcessedArray)
      state.images = cloned
      const filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
      state.filteredImages = sortImages(filteredImages, state.imageSortType)
      refreshImage2FolderMap(state)
      ImageBind(state)
    }
    state.fileProcessedArray = []
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
      const filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
      state.filteredImages = sortImages(filteredImages, state.imageSortType)
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
    const filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    state.filteredImages = sortImages(filteredImages, state.imageSortType)
    ImageBind(state)
  },
  ADD_IMAGE (state, image) {
    const cloned = _.clone(state.images)
    cloned.push(image)
    state.images = cloned
    const filteredImages = filter(state.images, state.selectedFolder, state.filterWord)
    state.filteredImages = sortImages(filteredImages, state.imageSortType)
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
  SET_DISPLAY_SETTING (state, bool) {
    state.displaySetting = bool
  },
  SET_IMAGE_SORT_TYPE (state, value) {
    if (value === state.imageSortType) {
      return
    }
    state.imageSortType = value
    const clonedFilterType = _.clone(state.filteredImages)
    state.filteredImages = sortImages(clonedFilterType, state.imageSortType)
  },
  SET_PALETTE_PROCESS_STATUS (state, value) {
    state.paletteProcessStatus = value
  },
  SET_PALETTE_QUEUE_LENGTH (state, value) {
    state.paletteQueueLength = value
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
  setMajorColor (context, color) {
    context.commit('SET_MAJOR_COLOR', color)
  },
  setZoomLevel (context, zoomLevel) {
    context.commit('SET_ZOOM_LEVEL', zoomLevel)
  },
  setCtrlStatus (context, ctrl) {
    context.commit('SET_CTRL_STATUS', ctrl)
  },
  setSelectedFolder (context, id) {
    context.commit('SET_SELECTED_FOLDER', id)
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
        return (containString(img.name, item) ||
        containElement(img.tags, item) ||
        containString(img.description, item) ||
         containString(img.url, item))
      })
    }
    return result
  })
}
/**
 *
 * @param {string[]} arr1
 * @param {string[]} arr2
 */
const sameStrArr = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      return false
    }
  }
  return true
}
const containElement = (arr, item) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    if (containString(element, item)) {
      return true
    }
  }
  return false
}
const containString = (long, short) => {
  return long.toLowerCase().indexOf(short.toLowerCase()) > -1
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
const sortImages = (filteredImages, imageSortType) => {
  let sortFunc = null
  switch (imageSortType) {
    case 1:
    // filename
      sortFunc = (left, right) => {
        return left.name > right.name ? 1 : -1
      }
      break
    case -1:
    // filename
      sortFunc = (left, right) => {
        return left.name < right.name ? 1 : -1
      }
      break
    case 2:
    // modification time
      sortFunc = (left, right) => {
        return left.lastModified > right.lastModified
      }
      break
    case -2:
      // modification time
      sortFunc = (left, right) => {
        return left.lastModified < right.lastModified
      }
      break
    case 3:
    // fileSize
      sortFunc = (left, right) => {
        return left.size > right.size
      }
      break
    case -3:
      // fileSize
      sortFunc = (left, right) => {
        return left.size < right.size
      }
      break
    default:
      sortFunc = (left, right) => {
        return left.name > right.name ? 1 : -1
      }
  }
  return filteredImages.sort(sortFunc)
}
