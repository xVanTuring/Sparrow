import fse from 'fs-extra'
import path from 'path'
import { ipcRenderer } from 'electron'
import sizeOf from 'image-size'
import { library, imageMetaWriteQueue, ErrorHandler, thumbSize, gm, paletteQueue } from './queue'
import randomId from './randomId'
/**
 *
 * @param {{lastModified:number,name:string,path:string,type:string,size:number,folder:string}} image
 * @param {*} cancelToken
 * @param {(err,image)=>void} callback
 */
export function processImage (image, cancelToken, callback) {
  // mkdir dir
  let id = randomId()
  let imageDir = path.join(library.imagesDir, id + '.image')
  let thumbPath = path.join(imageDir, image.name.replace(path.extname(image.name), '') + '_thumb.png')
  let imageTargetPath = path.join(imageDir, image.name)
  let { width, height } = sizeOf(image.path)
  // TODO: exif
  let imageMeta = {
    id: id,
    name: image.name.replace(path.extname(image.name), ''),
    ext: path.extname(image.name).replace('.', ''),
    width: width,
    height: height,
    folders: [],
    tags: [],
    exif: [],
    lastModified: image.lastModified,
    size: image.size,
    isDeleted: false,
    description: '',
    url: ''
  }
  if (image.folder) {
    // console.log(image.folder)
    imageMeta.folders = [image.folder]
  }
  fse
    .mkdir(imageDir)
    .then(() => {
      return fse.copy(image.path, imageTargetPath)
    })
    .then(() => {
      imageMetaWriteQueue.push({
        image: imageMeta
      }, err => {
        if (err) {
          ErrorHandler(err)
        }
        console.log('Meta Write Done')
      })
      if (width > thumbSize && height > thumbSize) {
        // large file
        let newSize = [thumbSize, null]
        if (width < height) {
          newSize = [null, thumbSize]
        }
        return gm(imageTargetPath)
          .resize(newSize[0], newSize[1])
          .writeAsync(thumbPath)
      }
    })
    .then(() => {
      // TODO: svg
      paletteQueue.push(imageMeta, err => {
        if (err) {
          ErrorHandler(err)
        }
      })
      ipcRenderer.send('ui-image-loaded', imageMeta)
      callback(null, imageMeta)
    })
    .catch(ErrorHandler)
}
