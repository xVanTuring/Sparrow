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
    //   store.commit('SET_DESIPLAY_SETTING', false)
    }
  }
}
</script>

<style lang="scss">
@import '@/globals.scss';
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
        box-shadow: 0 0 8px rgb(0, 0, 0);
    }
}
</style>
