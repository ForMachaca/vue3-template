<template>
  <div>
    <Header />
    <div id="container"> </div>
  </div>
</template>

<script setup lang="ts">
import Header from '/@/components/Header/index.vue'
import ThreeJs from "/@/components/Three/index"
let three:ThreeJs|null = null
onMounted(() => {
  const container = ref('container')
  three = new ThreeJs({container: document.getElementById('container')})
  console.log(three);
})
onBeforeUnmount(() => {
 three && (three.destroyed(), three = null)
 console.log(three);
})
</script>

<style scoped lang="less">
#container {
  width: 100%;
  height: 700px;
}
</style>
