import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import debounce from 'lodash/debounce.js'
import Measure from './Measure'
import { MeasureMode } from './Measure'
export default class ThreeJs {
  scene: THREE.Scene | null = null
  camera: THREE.PerspectiveCamera | null = null
  renderer: THREE.WebGLRenderer | null = null
  ambientLight: THREE.AmbientLight | null = null
  mesh: THREE.Mesh | null = null
  controls: OrbitControls | null = null
  labelRenderer: CSS2DRenderer | null = null
  onWindowResizeFn: Function | null = null
  container: HTMLElement | null = null
  meeasureTool: Measure | null = null

  constructor(container: HTMLElement | null) {
    container && this.init(container)
  }
  initMesure(measure = MeasureMode.Distance) {
    if (this.meeasureTool) {
      this.meeasureTool.close()
      this.meeasureTool = null
    }
    if (this.labelRenderer && this.scene && this.camera && this.controls) {
      this.meeasureTool = new Measure(this.labelRenderer, this.scene, this.camera, this.controls, measure)
      return this.meeasureTool
    } else {
      return null
    }
  }
  init(container: HTMLElement): void {
    this.container = container
    this.scene = new THREE.Scene()
    this.setCamera(container)
    this.setRenderer(container)
    this.setLabelRenderer(container)
    this.watchResize(container)
    this.setOrbitControls()
    this.setCube()
    this.animate()
  }
  destroyed() {
    this.controls && (this.controls.dispose(), (this.controls = null))
    this.renderer && (this.renderer.dispose(), (this.renderer = null))

    this.labelRenderer && (this.labelRenderer = null)
    this.camera && (this.camera = null)
    this.scene && (this.scene = null)
    this.onWindowResizeFn && window.removeEventListener('resize', this.onWindowResizeFn as any)
    // cancelAnimationFrame()
    this.container && this.container.parentNode && (this.container.parentNode.removeChild(this.container), (this.container = null))
  }
  setLabelRenderer(container): void {
    this.labelRenderer = new CSS2DRenderer()
    if (this.labelRenderer) {
      this.labelRenderer.setSize(container.clientWidth, container.clientHeight)
      this.labelRenderer.domElement.style.position = 'absolute'
      this.labelRenderer.domElement.style.top = 0 + 'px'
      container.appendChild(this.labelRenderer.domElement)
    }
  }
  // 鼠标操作控制器
  setOrbitControls(): void {
    // window.addEventListener('mousedown', this.onMouseDown, false)
    // window.addEventListener('mouseup', this.onMouseUp, false)
    if (this.labelRenderer) {
      this.controls = new OrbitControls(this.camera as THREE.Camera, this.labelRenderer.domElement)
      this.controls.mouseButtons = {
        // 左键平移
        LEFT: THREE.MOUSE.ROTATE,
        // 滚轮滑动
        MIDDLE: THREE.MOUSE.PAN,
        // 右键旋转
        RIGHT: THREE.MOUSE.ROTATE,
      }
      this.controls.enabled = true
      // 设置相机距离原点的最近距离
      this.controls.minDistance = 0
      // 设置相机距离原点的最远距离
      this.controls.maxDistance = 3000
      // 是否开启右键拖拽
      this.controls.enablePan = true
    }
  }

  // 新建透视相机
  setCamera(container): void {
    // console.log(container.clientWidth)
    // console.log(container.clientHeight)
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    this.camera.position.z = 5
  }

  // 设置渲染器
  setRenderer(container): void {
    this.renderer = new THREE.WebGLRenderer()
    // 设置画布的大小
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.style.position = 'relative'
    //canvas 画布  renderer.domElement
    container.appendChild(this.renderer.domElement)
  }

  // 设置环境光
  setLight(): void {
    if (this.scene) {
      this.ambientLight = new THREE.AmbientLight(0xffffff) // 环境光
      this.scene.add(this.ambientLight)
    }
  }

  // 创建网格模型
  setCube(): void {
    if (this.scene) {
      const geometry = new THREE.BoxGeometry() //创建一个立方体几何对象Geometry
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) //材质对象Material
      // const texture = new THREE.TextureLoader().load('/assets/imgs/dalishi.jpg') //首先，获取到纹理
      // const material = new THREE.MeshBasicMaterial({ map: texture }) //然后创建一个phong材质来处理着色，并传递给纹理映射
      this.mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
      this.scene.add(this.mesh) //网格模型添加到场景中
      this.render()
    }
  }

  // 渲染
  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
    if (this.labelRenderer && this.scene && this.camera) {
      this.labelRenderer.render(this.scene, this.camera)
    }
  }

  watchResize(container) {
    const onWindowResize = () => {
      // const container = document.getElementById('three-container')
      const width = container.clientWidth
      const height = container.clientHeight
      this.renderer && this.renderer.setSize(width, height)
      this.labelRenderer && this.labelRenderer.setSize(width, height)
      this.camera && (this.camera.aspect = width / height)
      this.camera && this.camera.updateProjectionMatrix()
    }
    this.onWindowResizeFn = debounce(onWindowResize, 150)
    // 屏幕自适应
    window.addEventListener('resize', this.onWindowResizeFn as any, false)
  }

  // 动画
  animate(): void {
    if (this.mesh) {
      requestAnimationFrame(this.animate.bind(this))
      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.01
      this.render()
    }
  }
}
