<template>
  <div>
    <Header />
    <div class="tools absolute top-14 z-10 right-0 bg-gray-300 flex text-xs  text-blue-900 rounded cursor-pointer">
      <!-- <SvgIcon name="svg-area" size="12" style="margin-right: 10px" /> -->

      <div
        class="p-2  hover:bg-indigo-600 hover:text-white"
        :class="activeTool==='Distance'?'bg-indigo-600 text-white': ''"
        @click="setTools('Distance')"
        >测距</div
      >
      <div
        class="p-2  hover:bg-indigo-600 hover:text-white active:bg-indigo-600 active:text-white"
        :class="activeTool==='Area'?'bg-indigo-600 text-white': ''"
        @click="setTools('Area')"
        >测面</div
      >
      <div
        class="p-2  hover:bg-indigo-600 hover:text-white active:bg-indigo-600 active:text-white"
        :class="activeTool==='Area'?'bg-indigo-600 text-white': ''"
        @click="setTools('Angle')"
        >测角</div
      >
      <div class="p-2  hover:bg-indigo-600 hover:text-white" @click="setTools(null)">清空</div>
    </div>
    <div id="container"> </div>
  </div>
</template>

<script setup lang="ts">
import Header from '/@/components/Header/index.vue'
import ThreeJs from "/@/components/Three/index"
import Measure from '/@/components/Three/Measure'
import { MeasureMode } from '/@/components/Three/Measure'
let three:ThreeJs|null = null
let tool:Measure|null
let activeTool = ref(null)
onMounted(() => {
  const container = ref('container')
  three = new ThreeJs(document.getElementById('container'))
  tool = three.initMesure(MeasureMode.Distance)

  // tool = three.initMesure(MeasureMode.Distance)
  // tool?.open()
  console.log(three);
  // console.log(tool);
})
const setTools = (val) => {
  activeTool.value = val
  if (tool && activeTool.value) {
     tool.open(val)
  }else {
    tool?.close()
  }
}
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

.tools {
  position: absolute;
  right: 0;
}
</style>
