<template>
  <div class="item" >
    <div class="thumbnail">
      <img :src="link">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.item {
	width: 250px;
	opacity: 0;
}
.item .thumbnail {
	max-height: 300px;
	overflow: hidden;
	border-radius: 2px;
}
.item .thumbnail img {
	width: 100%;
}

.item.animate {
	transition: opacity ease 1s;
	transition-delay: 0.2s;
	opacity: 1;
}
</style>
