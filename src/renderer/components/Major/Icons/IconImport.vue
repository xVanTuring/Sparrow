<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 200 200"
    role="presentation"
  >
  <g :fill="color">
    <path id="path1" d="m 27.273,0 h 63.636 q 3.763,0 6.427,2.664 2.663,2.664 2.663,6.428 0,3.763 -2.663,6.426 -2.664,2.664 -6.427,2.664 H 27.273 q -3.764,0 -6.428,2.664 -2.664,2.663 -2.664,6.427 v 145.454 q 0,3.764 2.664,6.427 2.664,2.664 6.428,2.664 h 145.454 q 3.764,0 6.428,-2.664 2.663,-2.663 2.663,-6.427 v -63.636 q 0,-3.764 2.664,-6.427 2.664,-2.664 6.427,-2.664 3.764,0 6.427,2.664 2.664,2.663 2.664,6.427 v 63.636 q 0,11.291 -7.991,19.282 Q 184.018,200 172.727,200 H 27.273 Q 15.982,200 7.991,192.009 0,184.018 0,172.727 V 27.273 Q 0,15.982 7.991,7.991 15.982,0 27.273,0 Z" />
    <path :class="{'is-import':isImport,'is-export':!isImport}" id="path2" d="m 136.18744,0.1425309 h 54.4995 q 3.76086,0 6.42164,2.6617779 2.66178,2.661777 2.66178,6.422635 V 63.726455 q 0,3.75986 -2.66178,6.42064 -2.66078,2.66177 -6.42164,2.66177 -3.75986,0 -6.42164,-2.66177 -2.66178,-2.66078 -2.66178,-6.42064 v -32.57381 l -75.36408,75.365065 q -2.62581,2.62481 -6.386671,2.62481 -3.904736,0 -6.493575,-2.58884 -2.588839,-2.58884 -2.588839,-6.49457 0,-3.760855 2.624809,-6.385655 l 75.365076,-75.36409 h -32.5728 q -3.76086,0 -6.42264,-2.66178 -2.66178,-2.66078 -2.66178,-6.4206412 0,-3.760857 2.66178,-6.422635 2.66178,-2.6617779 6.42264,-2.6617779 z" style="stroke-width:1"/>
  </g>
  </svg>
</template>
<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 22
    },
    height: {
      type: [Number, String],
      default: 22
    },
    color: {
      type: String,
      default: '#fff'
    },
    isImport: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped>
svg{
  cursor: pointer;
}
#path2{
  transform-origin: 40% 60%;
  transform: rotate(0deg);
}
.is-export{
  animation: rotate2 .3s forwards;
}
.is-import{
  animation: rotate .3s forwards;
}
@keyframes rotate{
  0% {
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(180deg);
  }
}
@keyframes rotate2{
  0% {
    transform: rotate(180deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
