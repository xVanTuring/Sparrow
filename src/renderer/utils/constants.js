export const fixedFolderID = {
  all: '$$all$$',
  trash: '$$trash$$',
  recent: '$$recent$$'
}
export const alphabet = 'qwertyuiopasdfghjklzxcvbnm'
export const allFixedFolderID = [
  fixedFolderID.all,
  fixedFolderID.trash,
  fixedFolderID.recent
]
export const commonFolder = [
  'Material Design',
  'Ant Design',
  'Long Shadow',
  'Movie Post',
  'Android Icon',
  'iOS Icon',
  'Fluent Design',
  'Architecture',
  'Woman',
  'Bird',
  'Sparrow',
  'Flowers',
  'Music',
  'Love'
]
export function choose (choices) {
  let index = Math.floor(Math.random() * choices.length)
  return choices[index]
}
