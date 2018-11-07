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
    <path d="M809.984 553.984l-256 0 0 256-84.010667 0 0-256-256 0 0-84.010667 256 0 0-256 84.010667 0 0 256 256 0 0 84.010667z" p-id="2907"/>
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
