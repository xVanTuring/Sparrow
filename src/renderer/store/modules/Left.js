/**
 * @typedef {{folderFilterWord:string,filteredFolders:any[],allFolders:any[]}} LeftState
 */
const state = {
  folderFilterWord: ''
}
const mutations = {
  /**
   *
   * @param {LeftState} state
   * @param {string} word
   */
  SET_FOLDER_FILTER_WORD (state, word) {
    state.folderFilterWord = word
  }
}
const actions = {
}
export default{
  state,
  mutations,
  actions
}
