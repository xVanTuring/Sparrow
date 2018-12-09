<template>
  <div class="context-item">
    {{title}}
    <div class="circle" v-if="activated"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    activated: Boolean
  }
}
</script>

<style lang="scss">
.context-item {
  display: flex;
  align-items: center;
  .circle {
    width: 8px;
    height: 8px;
    background-color: rgb(49, 141, 226);
    border-radius: 50%;
    margin-left: auto;
  }
}
</style>
