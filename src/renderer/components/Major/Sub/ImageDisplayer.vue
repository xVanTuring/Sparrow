<template>
  <div class="image-displayer">
    <img  v-for="image in imagesPath" :src="image" :key="image"/>
  </div>
</template>

<script>
// TODO: Long Image Display [x]
// TODO: better display
export default {
  props: {
    imagesPath: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    $('.image-displayer img').on('mousedown', function (e) {
      e.preventDefault()
    })
    this.arrangeItem()
  },
  watch: {
    imagesPath: function (newVal, oldV) {
      this.$nextTick(function () {
        this.arrangeItem()
      })
    }
  },
  methods: {
    arrangeItem () {
      const subImages = $('.image-displayer img')
      for (let index = 0; index < subImages.length; index++) {
        $(subImages[index]).css({
          'transform': `rotate(${(index % 6) * 4}deg)`
        })
      }
    }
  }
}
</script>

<style lang="scss">

.image-displayer{
  display: flex;
  justify-content: center;
  align-items: center;
  img{
      display: block;
      position: absolute;
      margin: auto;
      max-height: 180px;
      max-width: 180px;
      object-fit: cover;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
      transition-duration: .4s;
  }
  // .item-2{
  //   transform: rotate(8deg);
  // }
  // .item-3{
  //   transform: rotate(16deg);
  // }
  height: 230px;
  position: relative;
  // margin-top: 16px;
}

</style>
