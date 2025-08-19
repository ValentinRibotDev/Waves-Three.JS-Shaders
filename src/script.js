import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertex from './shaders/water/vertex.glsl'
import waterFragment from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Color
debugObject.surfaceColor = '#b8e9f5'
debugObject.depthColor = '#548eac'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader : waterVertex,
    fragmentShader : waterFragment,
    uniforms: {
        //bigWaves
        uAmplitude : { value: 0.2},
        uFrequency : { value: new THREE.Vector2(3.0, 1.5)},
        uTime: {value: 0.0},
        uSpeed: {value : 0.75},

        //Color
        uSurfaceColor: {value : new THREE.Color(debugObject.surfaceColor)},
        uDepthColor: {value : new THREE.Color(debugObject.depthColor)},
        uColorOffset: {value : 0.18},
        uColorMultiplier : {value : 3.7},

        //smallWaves
        uNoiseAmplitude : { value: 0.15},
        uNoiseFrequency : { value: 3.0},
        uNoiseIteration: {value: 4.0},
        uNoiseSpeed: {value : 0.2}
    }
})
const bigWaves = gui.addFolder('bigWaves')
const colorWaves = gui.addFolder('colorWaves')
const smallWaves = gui.addFolder('smallWaves')
bigWaves.add(waterMaterial.uniforms.uAmplitude, 'value').min(0).max(1).step(0.001).name('Big amplitude')
bigWaves.add(waterMaterial.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.001).name('Big frequenceX')
bigWaves.add(waterMaterial.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.001).name('Big frequenceY')
bigWaves.add(waterMaterial.uniforms.uSpeed, 'value').min(0).max(4).step(0.001).name('Big vitesse')

colorWaves.addColor(debugObject, 'surfaceColor').name('Surface').onChange(()=>{waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)})
colorWaves.addColor(debugObject, 'depthColor').name('Profondeur').onChange(()=>{waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
colorWaves.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('Offset')
colorWaves.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(1).max(10).step(0.001).name('Saturation')

smallWaves.add(waterMaterial.uniforms.uNoiseAmplitude, 'value').min(0).max(1).step(0.001).name('Small amplitude')
smallWaves.add(waterMaterial.uniforms.uNoiseFrequency, 'value').min(0).max(30).step(0.001).name('Small Frequency')
smallWaves.add(waterMaterial.uniforms.uNoiseIteration, 'value').min(0).max(10).step(1).name('Iteration')
smallWaves.add(waterMaterial.uniforms.uNoiseSpeed, 'value').min(0).max(4).step(0.001).name('Small Speed')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()