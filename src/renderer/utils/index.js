import { breadthFirstSearch } from 'tree-helper'
const supportedFileType = ['svg', 'png', 'jpeg', 'jpg', 'gif']
/**
 * check the `typeStr` is supported image or not
 * @param {string} typeStr  'image/png'
 */
export function imageType (typeStr) {
  if (typeStr.indexOf('image') === -1) {
    // not image
    return false
  } else {
    for (let i = 0; i < supportedFileType.length; i++) {
      if (typeStr.indexOf(supportedFileType[i]) !== -1) {
        return true
      }
    }
    return false
  }
}
/**
 *
 * @param {[]} tree
 */
export function folderWalker (tree, callback) {
  if (tree) {
    for (let i = 0; i < tree.length; i++) {
      callback(tree[i])
      folderWalker(tree[i].children, callback)
    }
  }
}
// desp
export function folderFinder (tree, id, callback) {
  if (tree) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === id) {
        callback(tree[i])
      } else {
        folderFinder(tree[i].children, id, callback)
      }
    }
  }
}
export function folderFinder2 (tree, id) {
  let targetNode = null
  breadthFirstSearch(tree, (item) => {
    if (item.id === id) {
      targetNode = item
      return false
    }
  })
  return targetNode
}
export function folderChildren (tree, id) {
  let targetFolder = folderFinder2(tree, id)
  let subFolders = []
  if (targetFolder) {
    folderWalker(targetFolder.children, (item) => {
      subFolders.push(item)
    })
  }

  return subFolders
}
