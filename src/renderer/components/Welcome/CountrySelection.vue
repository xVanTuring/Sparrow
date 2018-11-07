<template>
  <div 
    id="country-selection-root"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
  <transition-group name="country-selection" tag="div">
    <div :class="{'selected':selected===item.id&&displayAll,'flag-container':true,'single-flag':pathes.length===1}" 
        v-for="item in pathes" 
        :key="item.id"
        @click="click(item.id)"        
        >
      <img class="flag" :src="item.src"/>
    </div>
  </transition-group>

  </div>
</template>
<script>
import store from '@/store'
const pathes = [
  {src: '/static/svg/flags/flag-china.svg', id: 'zh-cn'},
  {src: '/static/svg/flags/flag-united-kingdom.svg', id: 'en'},
  {src: '/static/svg/flags/flag-south-korea.svg', id: 'kr'}
]
export default {
  data: function () {
    return {
      displayAll: false
    }
  },
  computed: {
    selected: function () {
      return store.state.App.language
    },
    pathes () {
      if (this.displayAll) {
        return pathes
      }
      return pathes.filter((item) => {
        return item.id === store.state.App.language
      })
    }
  },
  methods: {
    click (id) {
      store.commit('SET_LANGUAGE', id)
    },
    mouseEnter () {
      this.displayAll = true
    },
    mouseLeave () {
      this.displayAll = false
    }
  }
}
</script>

<style scoped>
.country-selection-enter, .country-selection-leave-to{
  opacity: 0;
  transform: translateX(-200px);
}
.country-selection-leave-active{
  position: absolute;
}
#country-selection-root{
  height: 38px;
}
.flag-container{
  margin-right: 2px;
  border: 3px solid transparent;
  border-radius: 50%;
  transition:border-color .3s ease, transform .5s ease;
  display: inline-block;
}
.flag-container.single-flag{
  margin-top: 7px;
}
.flag{
  display: block;
  width: 32px;
  transition:width .3s ease;
}
.single-flag .flag{
  width: 24px;
  /* filter: grayscale(90%); */
}
.flag-container.selected {
  border: 3px solid #318DE2;
}
</style>

