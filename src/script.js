import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/examples/jsm/Addons.js'

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

// BUSHES TEXTURE
const bushesColorTexture = textureLoader.load('bushes/diffusion.jpg')
bushesColorTexture.colorSpace = THREE.SRGBColorSpace
const bushesARMTexture = textureLoader.load('bushes/arm.jpg')
const bushesNormalTexture = textureLoader.load('bushes/normal.jpg')

// GRAVES TEXTURE
const gravesColorTexture = textureLoader.load('graves/diffusion.jpg')
gravesColorTexture.colorSpace = THREE.SRGBColorSpace
const gravesARMTexture = textureLoader.load('graves/arm.jpg')
const gravesNormalTexture = textureLoader.load('graves/normal.jpg')

// DOOR TEXTURE
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

const houseMeasurements = {
    width: 4, height: 3, depth: 4, 
    roofHeight: 2, roofPadding: .5,
    doorAspRatio: 1, doorHeight : 2,
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
    new THREE.PlaneGeometry(houseMeasurements.doorAspRatio * houseMeasurements.doorHeight, houseMeasurements.doorHeight, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
)
door.position.z = houseMeasurements.depth / 2 + 0.01
door.position.y = (houseMeasurements.doorHeight - houseMeasurements.height)/ 2

house.add(walls, roof, door)

// BUSHES
const bHeight= 0.5 * houseMeasurements.bushRadius
const bushGeometry = new THREE.SphereGeometry(houseMeasurements.bushRadius, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushesColorTexture,
    aoMap: bushesARMTexture,
    roughnessMap: bushesARMTexture,
    metalnessMap: bushesARMTexture,
    normalMap: bushesNormalTexture, 
    color: '#ccffcc'
})

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
const graveMaterial = new THREE.MeshBasicMaterial({
    map: gravesColorTexture,
    aoMap: gravesARMTexture,
    roughnessMap: gravesARMTexture,
    metalnessMap: gravesARMTexture,
    normalMap: gravesNormalTexture, 
})
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

// GHOST
const ghost1 = new THREE.PointLight('#0880ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#00ff88', 6)
ghost1.position.set(0, 0, 3)
ghost2.position.set(3, 0, 0)
ghost3.position.set(-3, 0, 0)

scene.add(ghost1, ghost2, ghost3)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// DOOR LIGHT
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, (houseMeasurements.doorHeight + houseMeasurements.height)/2, houseMeasurements.depth / 2 + 0.01)
scene.add(doorLight)

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
 * SHADOWS
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadown = true
ghost2.castShadown = true
ghost3.castShadown = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
roof.receiveShadow = true
floor.receiveShadow = true

for (const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// SHADOW OPTIMISATION
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * SKY
 */

const sky = new Sky()
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.setScalar(100)
scene.add(sky)

// scene.fog = new THREE.Fog('#02343f', 1, 13) // color, near, far -> ctrl how near from camera will fog start and how far wil it end
scene.fog = new THREE.FogExp2('#02343f', 0.15) // color, density. -> how dence the fog is. .. the fog starts right from the camera -> this is more realistic


/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    const angle1 = elapsedTime * .3
    ghost1.position.x = Math.sin(angle1) * 4
    ghost1.position.z = Math.cos(angle1) * 4
    ghost1.position.y = Math.sin(angle1) * Math.sin(angle1 * 2.34) * Math.sin(angle1 * 3.45) 
    
    const angle2 = -elapsedTime * .6
    ghost2.position.x = Math.sin(angle2) * 5
    ghost2.position.z = Math.cos(angle2) * 5
    ghost2.position.y = Math.sin(angle2) * Math.sin(-angle2 * .34) * Math.sin(angle2 * 4.45)

    const angle3 = elapsedTime 
    ghost3.position.x = Math.sin(angle3) * 4.5
    ghost3.position.z = Math.cos(angle3) * 4.5
    ghost3.position.y = Math.sin(angle3) * Math.sin(angle2 * 4.34) * Math.sin(angle2 * .45)    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()