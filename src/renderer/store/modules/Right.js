const state = {
  showFolderTab: false
}
const mutations = {

  SHOW_FOLDER_TAB (state) {
    state.showFolderTab = true
  },
  SHOW_IMAGE_TAB (state) {
    state.showFolderTab = false
  }
}
const actions = {
}
export default{
  state,
  mutations,
  actions
}
