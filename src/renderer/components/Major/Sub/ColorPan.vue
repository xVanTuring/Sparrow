<template>
  <div class="color-pan">
    <div class="color-pan-item" v-for="(color,index) in pattles" :key="color+index" :style="{backgroundColor:color}" >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    pattles () {
      return this.colors.map((color) => {
        return `rgb(${color.color[0]},${color.color[1]},${color.color[2]})`
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/globals.scss';
.color-pan{
  display: flex;
  align-items: center;
  height: 15px;
  margin: auto;
  width: 200px;
  .color-pan-item{
    width: 40px;
    height: 15px;
    transition: all .1s;
    &:hover{
      height: 22px;
      width: 42px;
      border-radius: 2px;
    }
  }
}
</style>
