<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 1024 1024"
    role="presentation"
    @mouseenter="enter"
    @mouseleave="leave"
  >
  <g :fill="color">
    <path d="M810.666667 273.066667 750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667 452.266667 512 213.333333 750.933333 273.066667 810.666667 512 571.733333 750.933333 810.666667 810.666667 750.933333 571.733333 512Z" p-id="2225" fill="#ffffff"></path>
  </g>
  </svg>
</template>
<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    hoverColor: {
      type: String,
      default: '#fff'
    },
    baseColor: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      color: this.baseColor
    }
  },
  methods: {
    enter () {
      this.color = this.hoverColor
    },
    leave () {
      this.color = this.baseColor
    }
  }
}
</script>
<style>
svg{
  cursor: pointer;
}
</style>
