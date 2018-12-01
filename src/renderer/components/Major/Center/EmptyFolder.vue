<template>
  <div class="empty-folder-root">
      <div class="info" :class="{'search':type===1}">
        <div class="title">
          {{type===0?'Nothing Here':'No Image Found'}}
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">

.empty-folder-root{
  color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .info{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 560px;
    height: 400px;
    border: 1px dashed rgba(196, 196, 196, 0.123);
    &.search{
      border-color: transparent;
    }
  }
  .title{
    margin-top: 0px;
  }
}
</style>
