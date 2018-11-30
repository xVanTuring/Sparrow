<template>
    <div class="setting-root" @click.self="maskClick">
        <div class="setting-board">
            
        </div>
    </div>
</template>

<script>
// import store from '../../store'
export default {
  methods: {
    maskClick () {
    //   store.commit('SET_DISPLAY_SETTING', false)
    }
  }
}
</script>

<style lang="scss">

.setting-root{
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    left: 0;
    top: 40px;
    background-color: rgba(26, 26, 26, 0.658);
    display: flex;
    justify-content: center;
    align-items: center;
    .setting-board{
        width: 760px;
        height: 460px;
        background: rgb(31, 31, 31);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    }
}
</style>
