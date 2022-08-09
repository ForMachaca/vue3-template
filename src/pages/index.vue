<template>
  <div>
    <Header />
    <div id="container"> </div>
  </div>
</template>

<script setup lang="ts">
import Header from '/@/components/Header/index.vue'
import ThreeJs from "/@/components/Three/index"
import Measure from '/@/components/Three/Measure'
// import { MeasureMode } from '@/components/Three/Measure'
let three:ThreeJs|null = null

onMounted(() => {
  const container = ref('container')
  three = new ThreeJs(document.getElementById('container'))
  let tool = three.initMesure()
  tool?.open()
  console.log(three);
  console.log(tool);
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
