const state = {
  changingSortType: true
}
const mutations = {
  SET_SORT_TYPE (state, value) {
    state.changingSortType = value
  }
}
export default{
  state,
  mutations
}
