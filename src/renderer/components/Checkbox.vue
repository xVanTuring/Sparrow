<template>
<div class="check-box-container">
    <div class="check-box-outline" @click="toggle">
      <div :class="{'check-box-indi':true, checked:checked}"></div>
    </div> 
    <div class="check-box-title">
      Overwrite Library
    </div>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      checked: false
    }
  },
  methods: {
    toggle () {
      this.checked = !this.checked
    }
  }
}
</script>
<style>
.check-box-container{
  display: flex;
  /* justify-content:center; */
  align-items:center;
}
.check-box-title{
  height: 18px;
  font-size: 14px;
  line-height: 18px;
  color: white;
  margin-left: 8px;
}
.check-box-outline{
  width: 18px;
  height: 18px;
  border: 2px solid #318DE2;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
.check-box-indi{
  transition-duration: .3s ;
  transition-timing-function: ease;
  width: 8px;
  height: 8px;
  background-color: transparent;
  transform: scale(0);
  margin: auto;
  margin-top: 3px;
  border-radius: 1px;
}
.checked{
  width: 8px;
  height: 8px;
  background-color: #318DE2;
  transform: scale(1);
}
</style>


