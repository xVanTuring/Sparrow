<template>
  <div class="major">
    <Left></Left>
    <Center></Center>
    <Right></Right>
    <Bottom></Bottom>
  </div>
</template>
<script>
import Left from './Left/Left'
import Center from './Center/Center'
import Right from './Right/Right'
import Bottom from './Bottom/Bottom'
export default {
  components: {
    Left,
    Center,
    Right,
    Bottom
  }
}
</script>
<style>
.major{
  height: 100vh;
  position: relative;
}
</style>


