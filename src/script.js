import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * TEXTURES
 */
const textureLoader = new THREE.TextureLoader()

// FLOOR TEXTURES
const floorAlphaTexture = textureLoader.load('floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')

floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorARMTexture.repeat.set(8, 8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.repeat.set(8, 8)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.repeat.set(8, 8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// WALL TEXTURES
const wallColorTexture = textureLoader.load('walls/diffusion.jpg')
const wallARMTexture = textureLoader.load('walls/arm.jpg')
const wallNormalTexture = textureLoader.load('walls/normal.jpg')
wallColorTexture.colorSpace = THREE.SRGBColorSpace

// ROOF TEXTURES
const roofColorTexture = textureLoader.load('roof/diffusion.jpg')
const roofARMTexture = textureLoader.load('roof/arm.jpg')
const roofNormalTexture = textureLoader.load('roof/normal.jpg')
roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
/**
 * House
 */

const houseMeasurements = {
    width: 4, height: 3, depth: 4, 
    roofHeight: 2, roofPadding: .5,
    doorAspRatio: 2/3, doorHeight : 1.4,
    bushRadius: .5
}

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture, transparent: true,
        map: floorColorTexture,
        metalnessMap: floorARMTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -.2
    })
)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

// HOUSE
const house = new THREE.Group()
scene.add(house)
house.position.y = (houseMeasurements.height) / 2

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasurements.width, houseMeasurements.height, houseMeasurements.depth),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
        metalnessMap: wallARMTexture
    })
)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseMeasurements.width/Math.SQRT2 + houseMeasurements.roofPadding, houseMeasurements.roofHeight, 4, 1, false),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
        metalnessMap: roofARMTexture
    })
)
roof.rotation.y = Math.PI / 4
roof.position.y = (houseMeasurements.height + houseMeasurements.roofHeight)/2

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseMeasurements.doorAspRatio * houseMeasurements.doorHeight, houseMeasurements.doorHeight),
    new THREE.MeshStandardMaterial({color: 'yellow'})
)
door.position.z = houseMeasurements.depth / 2 + 0.01
door.position.y = (houseMeasurements.doorHeight - houseMeasurements.height)/ 2

house.add(walls, roof, door)

// BUSHES
const bHeight= 0.5 * houseMeasurements.bushRadius
const bushGeometry = new THREE.SphereGeometry(houseMeasurements.bushRadius, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial()

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1+houseMeasurements.bushRadius, bHeight , houseMeasurements.depth/2 + houseMeasurements.bushRadius)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(.8, bHeight*.6, houseMeasurements.depth/2 + houseMeasurements.bushRadius*.8)
bush2.scale.setScalar(0.6)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-1, bHeight*1.5, houseMeasurements.depth/2 + houseMeasurements.bushRadius)
bush3.scale.set(.7, 1.2, .7)

scene.add(bush1, bush2, bush3)

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshBasicMaterial()
for (let i=0; i<30; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * 2 * Math.PI
    const dist = Math.random() * (14 - houseMeasurements.width - 1) / 2 + houseMeasurements.width / 2 + 2.5
    grave.position.set(Math.sin(angle)*dist, .4*Math.random(), Math.cos(angle)*dist)
    grave.rotation.x = (Math.random() - .5) * .4
    grave.rotation.y = (Math.random() - .5) * .4
    grave.rotation.z = (Math.random() - .5) * .4
    
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()