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
    <path v-if="!open"  d="M952 192H489l-25-77.9C454.5 84.2 426.8 64 395.4 64H72C32.2 64 0 96.2 0 136v688c0 39.8 32.2 72 72 72h880c39.8 0 72-32.2 72-72V264c0-39.8-32.2-72-72-72zM72 136h323.4l17.9 56H72v-56z m880 688H72V264h880v560z"/>
    <path v-else d="M960 384.4V264c0-39.8-32.2-72-72-72H489l-25-77.9C454.5 84.2 426.8 64 395.4 64H72C32.2 64 0 96.2 0 136v688.3c0 3.5 0.3 7 0.8 10.4 0 0.1 0 0.3 0.1 0.4 0.2 1 0.3 2 0.5 3 0.1 0.3 0.1 0.6 0.2 0.8 0.2 0.8 0.4 1.7 0.6 2.5 0.1 0.5 0.3 1 0.4 1.5l0.3 1.2c0.3 1.1 0.6 2.1 1 3.1v0.1c3.7 10.8 9.9 20.4 18 28.2l0.2 0.2c0.8 0.7 1.5 1.4 2.3 2.1 0.4 0.3 0.8 0.7 1.1 1 0.4 0.3 0.7 0.6 1.1 0.9 0.6 0.5 1.3 1 2 1.6 0.2 0.1 0.4 0.3 0.6 0.4 0.8 0.6 1.7 1.2 2.5 1.8 0.1 0 0.1 0.1 0.2 0.1 9.4 6.3 20.4 10.6 32.5 11.8 0.2 0 0.3 0 0.5 0.1 1.1 0.1 2.1 0.2 3.2 0.2h0.6c1.1 0 2.2 0.1 3.3 0.1h788c33 0 61.8-22.5 69.9-54.5l92-368c10.6-42.6-19.3-84.2-61.9-88.9zM72 136h323.2l41.2 128H888v120H164c-33 0-61.8 22.5-69.9 54.5L72 527.3V136z m788 688H72l92-368h788l-92 368z" />
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
    },
    open: {
      type: Boolean,
      default: true
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
