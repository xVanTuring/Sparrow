<template>
  <div class="major">
    <Left></Left>
    <Center></Center>
    <Right></Right>
    <Bottom></Bottom>
  </div>
</template>
<script>
import Left from './Left'
import Center from './Center'
import Right from './Right'
import Bottom from './Bottom'
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


