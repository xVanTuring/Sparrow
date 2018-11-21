/* eslint-disable no-unused-vars */
/**
 * @typedef {{id:string,name:string,oldName?:string,newName?:string,ext:string}} Image
 * @typedef {{children:Folder[],id:string,modificationTime:number,name:string,images:[]}} Folder
 * @typedef {{folders:Folder[],modificationTime:number,appVersion:string,metaPath:string,imagesDir:string}} Library
 */
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { ipcRenderer, remote } from 'electron'
import async from 'async'
import settings from 'electron-settings'
import tokenSource from 'cancellation'
import bluebird from 'bluebird'
// import palette from 'image-palette2'
import * as utils from '../utils'
import { processImage } from './processImage'
// https://github.com/aheckmann/gm/issues/754
// import gm from 'gm'
export const gm = require('gm').subClass({
  appPath: 'E:\\App\\GraphicsMagick-1.3.30-Q16\\'
})
var palette = require('image-palette')
var pixels = require('image-pixels')
bluebird.promisifyAll(gm.prototype)
const appVersion = remote.app.getVersion()
const taskTokens = []
console.log('Sparrow: ', appVersion)
/**
 * @type Library
 */
export let library = {}
const dialog = remote.dialog
// max-watch notify
let metaFileWatcher
/**
 * queue for write Library file
 * @type {async.AsyncQueue} libraryWriteQueue
 */
let libraryWriteQueue
/**
 * queue for process image file
 * @type {async.AsyncQueue} imageProcessQueue
 */
let imageProcessQueue
/**
 * queue for write image meta file
 * @type {async.AsyncQueue} imageMetaWriteQueue
 */
export let imageMetaWriteQueue
/**
 * queue for gen palette
 * @type {async.AsyncQueue} paletteQueue
 */
export let paletteQueue
export function ErrorHandler (err) {
  // send log the electron
  console.error(err)
}
const paletteTask = async (task) => {
  try {
    let { id, width, height, name, ext } = task
    if (ext === 'svg') {
      // callback()
      // auto generate temp stream
      return
    }
    let imageDir = path.join(library.imagesDir, id + '.image')
    let configFilePath = path.join(imageDir, 'metadata.json')
    let thumbPath = path.join(imageDir, name + '_thumb.png')
    let imageTargetPath = path.join(imageDir, name + '.' + ext)
    let finalPath = imageTargetPath
    if (width > thumbSize && height > thumbSize) {
      finalPath = thumbPath
    }
    var { amount, colors } = palette(await pixels(finalPath))
    if (colors) {
      if (fs.existsSync(configFilePath)) {
        imageMetaWriteQueue.push({
          image: {
            id: id,
            palettes: colors
          },
          update: true
        }, (err, meta) => {
          if (err) {
            ErrorHandler(err)
          } else {
            ipcRenderer.send('ui-update-image', meta)
          }
        })
      } else {
        ErrorHandler('Meta File Not Found')
        return Promise.reject(new Error('Meta File Not Found'))
      }
    }
  } catch (error) {
    ErrorHandler(error)
    return Promise.reject(error)
  }
}
function initQueue () {
  libraryWriteQueue = async.queue((task, callback) => {
    // let params = task.params
    // TODO: smart Folders ...
    let { folders } = task.library
    // let rootDir = settings.get('rootDir')
    utils.folderWalker(folders, folder => {
      delete folder.count
      delete folder.images
    })
    let newLibrary = {
      folders: folders,
      modificationTime: Date.now(),
      appVersion: appVersion
    }
    fs.writeFile(library.metaPath, JSON.stringify(newLibrary), err => {
      if (err) {
        callback(err)
      } else {
        library.modificationTime = newLibrary.modificationTime
        callback()
        console.log('bg-library-write-done')
      }
    })

    // write over one by one
  }, 1)
  imageMetaWriteQueue = async.queue((task, callback) => {
    // TODO: Handle Quit Event
    /**
     * @type Image
     */
    let imageMeta = task.image
    let update = task.update || false
    if (update) {
      let metaPath = path.join(
        library.imagesDir,
        imageMeta.id + '.image',
        'metadata.json'
      )
      if (fs.existsSync(metaPath)) {
        fse
          .readFile(metaPath)
          .then(buf => {
            let oldMeta = JSON.parse(buf.toString())
            let meta = {
              ...oldMeta,
              ...imageMeta
            }
            let str = JSON.stringify(meta)
            if (imageMeta.name) {
              let oldPath = path.join(
                library.imagesDir,
                imageMeta.id + '.image',
                oldMeta.name + '.' + oldMeta.ext
              )
              let newPath = path.join(
                library.imagesDir,
                imageMeta.id + '.image',
                meta.name + '.' + oldMeta.ext
              )
              let oldThum = path.join(
                library.imagesDir,
                imageMeta.id + '.image',
                oldMeta.name + '_thumb.png'
              )
              let newThum = path.join(
                library.imagesDir,
                imageMeta.id + '.image',
                meta.name + '_thumb.png'
              )
              if (fs.existsSync(oldPath)) {
                fse.renameSync(oldPath, newPath)
              }
              if (fs.existsSync(oldThum)) {
                fse.renameSync(oldThum, newThum)
              }
            }
            return fse.writeFile(metaPath, str).then(() => {
              return meta
            })
          })
          .then(meta => {
            callback(null, meta)
          })
          .catch(err => {
            ErrorHandler(err)
            callback(err)
          })
      } else {
        ErrorHandler('Meta Path Not Found: ' + metaPath)
        callback()
      }
    } else {
      let metaPath = path.join(library.imagesDir, imageMeta.id + '.image')
      if (fs.existsSync(metaPath)) {
        if (imageMeta.name == null || imageMeta.name === '') {
          // some default name
          imageMeta.name = 'defaultName'
        }
        try {
          let str = JSON.stringify(imageMeta)
          fse
            .writeFile(path.join(metaPath, 'metadata.json'), str)
            .then(() => {
              callback()
            })
            .catch(err => {
              ErrorHandler(err)
              callback(err)
            })
        } catch (err) {
          ErrorHandler(err)
          callback(err)
        }
      } else {
        ErrorHandler('Meta Path Not Found: ' + metaPath)
        callback()
      }
    }
  }, 20)
  imageProcessQueue = async.queue((task, callback) => {
    // TODO: add to user setting
    if (task.cancelToken.isCancelled()) {
      callback()
      return
    }
    processImage(task.image, null, (err, image) => {
      if (err) {
        ErrorHandler(err)
      }
      callback()
    })
  }, 10)
  paletteQueue = async.queue(paletteTask)
}
initQueue()
function createLibrary (parentPath, libraryName) {
  function error () {}
  // make sure the parentFolder exists
  if (fs.existsSync(parentPath)) {
    let fullLibraryPath = path.join(parentPath, libraryName)
    let imagesPath = path.join(parentPath, libraryName, 'images')
    // if libraryExists
    if (fs.existsSync(fullLibraryPath)) {
      error('Library Exists')
    } else {
      let libraryMetadata = {
        folders: [],
        modificationTime: Date.now(),
        appVersion: appVersion,
        app: 'Sparrow'
      }
      fse
        .mkdir(fullLibraryPath)
        .then(() => {
          return fse.mkdir(imagesPath)
        })
        .then(() => {
          return fse.writeFile(
            path.join(fullLibraryPath, 'library.json'),
            JSON.stringify(libraryMetadata)
          )
        })
        .then(() => {
          let histLibrary = settings.get('libraryHistory', [])
          if (histLibrary.lastIndexOf(fullLibraryPath) !== -1) {
            histLibrary.splice(histLibrary.lastIndexOf(fullLibraryPath), 1)
          }
          histLibrary.unshift(fullLibraryPath)
          histLibrary = histLibrary.slice(0, 10)
          settings
            .set('rootDir', fullLibraryPath)
            .set('libraryHistory', histLibrary)
          // re-init
          initLibrary()
        })
        .catch(ErrorHandler)
    }
  } else {
    error("Path Doesn't Exist")
  }
}
function initLibrary () {
  // check if we have one library if not notify the GUI
  const rootDir = settings.get('rootDir', '')
  if (rootDir === '') {
    ipcRenderer.send('ui-create-library')
    return
    // notify GUI
  }
  // make sure we have library.jon
  let metaPath = path.join(rootDir, 'library.json')
  if (!fs.existsSync(metaPath)) {
    // notify GUI with file missing
    // TODO: i18n
    dialog.showErrorBox(
      'Config File Missed',
      'You Need To Create A New Library'
    )
    ErrorHandler('')
    return
  }
  // generate images folder in case user deletes all images
  if (!fs.existsSync(path.join(rootDir, 'images'))) {
    fs.mkdirSync(path.join(rootDir, 'images'))
  }
  // TODO: remove loadlibrary
  library = loadLibrary(metaPath)
  // if metadata broken
  if (!library) {
    return
  }
  // for watchers and operations
  library.rootDir = path.join(rootDir)
  library.imagesDir = path.join(rootDir, 'images')
  // load images
  loadImages((err, images) => {
    if (err) {
      ErrorHandler(err)
    } else {
      ipcRenderer.send('ui-library-loaded', {
        libraryDir: library.rootDir,
        folders: library.folders,
        images: images
      })
    }
  })
  // TODO: cache the image list for fast response
  // watch meta file
  // if (metaFileWatcher) {
  //   metaFileWatcher.close()
  // }
  // metaFileWatcher = fs.watch(metaPath, () => {
  //   if (!fs.existsSync(metaPath)) {
  //     // metadata file losted
  //     initLibrary() // ==> go to library create
  //   } else {
  //     // reload
  //     let data = fs.readFileSync(path.join(rootDir, 'library.json'))
  //     if (data !== '') {
  //       try { // for parse error
  //         let newLibrary = JSON.parse(data)
  //         if (library && newLibrary) {
  //           if (library.modificationTime < newLibrary.modificationTime) {
  //             library.modificationTime = newLibrary.modificationTime
  //             // send new library to gui
  //             ipcRenderer.send('library-changed', newLibrary)
  //           }
  //         }
  //       } catch (err) {
  //         // UNIVERSAL
  //       }
  //     }
  //   }
  // })
  // TODO: watch images folder
  // images metadata.json || image folder
  // TODO: Heart Beat
}
/**
 *
 * @param {string} libraryMetaPath
 * @returns {null|Library} the library
 */
function loadLibrary (libraryMetaPath) {
  try {
    if (!fs.existsSync(libraryMetaPath)) {
      ErrorHandler('Library.json Lost')
      return
    }
    let metaData = fs.readFileSync(libraryMetaPath)
    let library = JSON.parse(metaData)
    library.folders.forEach(folder => {
      folder.images = []
    })
    library.metaPath = libraryMetaPath
    return library
  } catch (err) {
    // notify ui
    ErrorHandler(err)
  }
}
/**
 * read images-dir -> open all metadata.json
 * @param {(err,images:[])=>void} callback
 */
function loadImages (callback) {
  fse
    .readdir(library.imagesDir)
    .then(files => {
      let imageIds = []
      library.imageMetadatas = []

      files.forEach(item => {
        //  macOS
        if (item === '.DS_STORE') {
          return
        }
        let id = item.replace('.image', '')
        // TODO: check id
        imageIds.push(id)
        library.imageMetadatas.push(
          path.join(library.imagesDir, item, 'metadata.json')
        )
      })
      // notify ui loading length
      let parallList = library.imageMetadatas.map(file => {
        return callback => {
          fse.readFile(file, (err, result) => {
            // Notify UI
            if (err) {
              callback(err)
            } else {
              try {
                callback(null, JSON.parse(result))
              } catch (err) {
                callback(err)
              }
            }
          })
        }
      })
      async.parallelLimit(parallList, 20, (err, result) => {
        if (err) {
          callback(err)
        } else {
          callback(null, result)
        }
      })
    })
    .catch(ErrorHandler)
}
initLibrary()
export const thumbSize = 620
