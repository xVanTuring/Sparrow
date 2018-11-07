<template>
  <div class="image-displayer">
    <img v-if="imagesPath.length>0"  class="img-displayer item-1" :class="{single:imagesPath.length===1}" :src="imagesPath[0]"/>
    <img v-if="imagesPath.length>1" class="img-displayer item-2" :src="imagesPath[1]"/>
    <img v-if="imagesPath.length>2"  class="img-displayer item-3" :src="imagesPath[2]"/>
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
    $('.img-displayer').on('mousedown', function (e) {
      e.preventDefault()
    })
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
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.733);
  }
  .item-2{
    transform: rotate(8deg);
  }
  .item-3{
    transform: rotate(16deg);
  }
  height: 230px;
  position: relative;
  // margin-top: 16px;
}

</style>
