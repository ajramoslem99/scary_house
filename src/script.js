import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 320 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//fog

const fog = new THREE.Fog("#262837", 2, 10);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const textureBase = `${import.meta.env.BASE_URL}textures/`;

const doorColorTexture = textureLoader.load(`${textureBase}door/color.jpg`);
const doorAlphaTexture = textureLoader.load(`${textureBase}door/alpha.jpg`);
const doorHeightTexture = textureLoader.load(`${textureBase}door/height.jpg`);
const doorMetalnessTexture = textureLoader.load(`${textureBase}door/metalness.jpg`);
const doorNormalTexture = textureLoader.load(`${textureBase}door/normal.jpg`);
const doorRoughnessTexture = textureLoader.load(`${textureBase}door/roughness.jpg`);
const doorAmbientOcclusionexture = textureLoader.load(
  `${textureBase}door/ambientOcclusion.jpg`,
);

const bricksColorTexture = textureLoader.load(`${textureBase}bricks/color.jpg`);
const bricksAmbientOcclusionTexture = textureLoader.load(
  `${textureBase}bricks/ambientOcclusion.jpg`,
);
const bricksNormalTexture = textureLoader.load(`${textureBase}bricks/normal.jpg`);
const bricksRoughnessTexture = textureLoader.load(
  `${textureBase}bricks/roughness.jpg`,
);

const grassColorTexture = textureLoader.load(`${textureBase}grass/color.jpg`);
grassColorTexture.colorSpace = THREE.SRGBColorSpace;
const grassAmbientOcclusionTexture = textureLoader.load(
  `${textureBase}grass/ambientOcclusion.jpg`,
);
const grassNormalTexture = textureLoader.load(`${textureBase}grass/normal.jpg`);
const grassRoughnessTexture = textureLoader.load(
  `${textureBase}grass/roughness.jpg`,
);

const grassTextures = [
  grassColorTexture,
  grassAmbientOcclusionTexture,
  grassNormalTexture,
  grassRoughnessTexture,
];

// Tile every map identically so color, surface detail, and roughness line up.
for (const texture of grassTextures) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
}

const graveColorTexture = textureLoader.load(`${textureBase}grave/color.jpg`);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveHeightTexture = textureLoader.load(`${textureBase}grave/height.jpg`);
const graveRoughnessTexture = textureLoader.load(
  `${textureBase}grave/roughness.jpg`,
);

// The inscription covers each broad face once; do not tile the lettering.
const graveFaceColorTexture = textureLoader.load(`${textureBase}grave/face-color.jpg`);
graveFaceColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveFaceHeightTexture = textureLoader.load(`${textureBase}grave/face-height.jpg`);
const graveFaceRoughnessTexture = textureLoader.load(
  `${textureBase}grave/face-roughness.jpg`,
);

const rockColorTexture = textureLoader.load(`${textureBase}rock/color.jpg`);
rockColorTexture.colorSpace = THREE.SRGBColorSpace;
const rockHeightTexture = textureLoader.load(`${textureBase}rock/height.jpg`);
const rockRoughnessTexture = textureLoader.load(`${textureBase}rock/roughness.jpg`);

// Keep the rock maps aligned and wrap them around each sphere.
for (const texture of [
  rockColorTexture,
  rockHeightTexture,
  rockRoughnessTexture,
]) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
}
/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  }),
);

walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
);

walls.position.y = 1.5;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  }),
);

roof.position.y = 3.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),

  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  }),
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

//bushes

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: rockColorTexture,
  bumpMap: rockHeightTexture,
  bumpScale: 0.09,
  roughnessMap: rockRoughnessTexture,
  roughness: 1,
  metalness: 0,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.1);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//graves

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  bumpMap: graveHeightTexture,
  bumpScale: 0.035,
  roughnessMap: graveRoughnessTexture,
  roughness: 1,
  metalness: 0,
});

// Reuse the stone settings, with carved lettering on the front and back.
const graveFaceMaterial = graveMaterial.clone();
graveFaceMaterial.map = graveFaceColorTexture;
graveFaceMaterial.bumpMap = graveFaceHeightTexture;
graveFaceMaterial.bumpScale = 0.015;
graveFaceMaterial.roughnessMap = graveFaceRoughnessTexture;

// BoxGeometry material order: right, left, top, bottom, front, back.
const graveMaterials = [
  graveMaterial,
  graveMaterial,
  graveMaterial,
  graveMaterial,
  graveFaceMaterial,
  graveFaceMaterial,
];

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;

  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterials);
  grave.castShadow = true;

  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughnessMap: grassRoughnessTexture,
  }),
);

floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

//door Light
const doorLight = new THREE.PointLight("#ff7f47", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

//ghosts

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

// shadows

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Improve grass texture sampling when looking across the floor at a low angle.
const grassAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
for (const texture of grassTextures) {
  texture.anisotropy = grassAnisotropy;
}

/**
 * Scene controls
 */
const sceneSettings = {
  fogEnabled: true,
  fogColor: `#${fog.color.getHexString()}`,
  animateGhosts: true,
  ghostSpeed: 1,
  graveTint: "#ffffff",
  rockTint: "#ffffff",
  resetView() {
    controls.reset();
    camera.fov = 75;
    camera.updateProjectionMatrix();
  },
};

const atmosphereFolder = gui.addFolder("Atmosphere");
atmosphereFolder.add(sceneSettings, "fogEnabled").name("Enable fog").onChange((enabled) => {
  scene.fog = enabled ? fog : null;
});
atmosphereFolder.addColor(sceneSettings, "fogColor").name("Fog & sky color").onChange((color) => {
  fog.color.set(color);
  renderer.setClearColor(fog.color);
});
// Keep the fog interval valid even when either slider crosses the other.
atmosphereFolder.add(fog, "near", 0, 20, 0.1).name("Fog starts at").listen().onChange((near) => {
  if (near >= fog.far) fog.far = near + 0.1;
});
atmosphereFolder.add(fog, "far", 0.1, 40, 0.1).name("Fog fully hides at").listen().onChange((far) => {
  if (far <= fog.near) fog.near = Math.max(0, far - 0.1);
});

// All lights share color and brightness controls; point lights also have a range.
function addLightControls(folder, light) {
  const settings = { color: `#${light.color.getHexString()}` };
  folder.add(light, "visible").name("Enabled");
  folder.addColor(settings, "color").name("Light color").onChange((color) => {
    light.color.set(color);
  });
  folder.add(light, "intensity", 0, light.isPointLight ? 10 : 2, 0.01).name("Brightness");
  if (light.isPointLight) {
    folder.add(light, "distance", 1, 15, 0.1).name("Light range").onChange((distance) => {
      light.shadow.camera.far = distance;
      light.shadow.camera.updateProjectionMatrix();
    });
  }
}

const lightingFolder = gui.addFolder("Lighting");
const ambientFolder = lightingFolder.addFolder("Ambient fill");
addLightControls(ambientFolder, ambientLight);
const moonFolder = lightingFolder.addFolder("Moonlight");
addLightControls(moonFolder, moonLight);
moonFolder.add(moonLight.position, "x", -10, 10, 0.1).name("Position X");
moonFolder.add(moonLight.position, "y", 0.5, 10, 0.1).name("Height");
moonFolder.add(moonLight.position, "z", -10, 10, 0.1).name("Position Z");
const entranceFolder = lightingFolder.addFolder("Entrance glow");
addLightControls(entranceFolder, doorLight);

const ghostsFolder = gui.addFolder("Ghost Lights");
ghostsFolder.add(sceneSettings, "animateGhosts").name("Animate movement");
ghostsFolder.add(sceneSettings, "ghostSpeed", 0, 3, 0.05).name("Movement speed");
addLightControls(ghostsFolder.addFolder("Ghost 1 · Magenta"), ghost1);
addLightControls(ghostsFolder.addFolder("Ghost 2 · Cyan"), ghost2);
addLightControls(ghostsFolder.addFolder("Ghost 3 · Yellow"), ghost3);

const materialsFolder = gui.addFolder("Materials");
const gravesFolder = materialsFolder.addFolder("Gravestones");
gravesFolder.addColor(sceneSettings, "graveTint").name("Stone tint").onChange((color) => {
  graveMaterial.color.set(color);
  graveFaceMaterial.color.set(color);
});
gravesFolder.add(graveMaterial, "roughness", 0, 1, 0.01).name("Stone roughness").onChange((roughness) => {
  graveFaceMaterial.roughness = roughness;
});
gravesFolder.add(graveMaterial, "bumpScale", 0, 0.1, 0.001).name("Stone grain depth");
gravesFolder.add(graveFaceMaterial, "bumpScale", 0, 0.06, 0.001).name("Carving depth");
const rocksFolder = materialsFolder.addFolder("Entrance rocks");
rocksFolder.addColor(sceneSettings, "rockTint").name("Rock tint").onChange((color) => {
  bushMaterial.color.set(color);
});
rocksFolder.add(bushMaterial, "roughness", 0, 1, 0.01).name("Rock roughness");
rocksFolder.add(bushMaterial, "bumpScale", 0, 0.2, 0.001).name("Rock grain depth");
const groundFolder = materialsFolder.addFolder("Grass & roof");
groundFolder.add(floor.material, "roughness", 0, 1, 0.01).name("Grass roughness");
groundFolder.add(roof.material, "roughness", 0, 1, 0.01).name("Roof roughness");

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera, "fov", 35, 100, 1).name("Field of view").listen().onChange(() => {
  camera.updateProjectionMatrix();
});
cameraFolder.add(controls, "enableDamping").name("Smooth movement");
cameraFolder.add(controls, "autoRotate").name("Auto orbit");
cameraFolder.add(controls, "autoRotateSpeed", -3, 3, 0.1).name("Orbit speed");
cameraFolder.add(sceneSettings, "resetView").name("Reset camera view");

const shadowsFolder = gui.addFolder("Shadows");
shadowsFolder.add(renderer.shadowMap, "enabled").name("Enable all shadows");
shadowsFolder.add(moonLight, "castShadow").name("Moonlight shadows");
shadowsFolder.add(doorLight, "castShadow").name("Entrance shadows");
shadowsFolder.add(ghost1, "castShadow").name("Ghost 1 shadows");
shadowsFolder.add(ghost2, "castShadow").name("Ghost 2 shadows");
shadowsFolder.add(ghost3, "castShadow").name("Ghost 3 shadows");
atmosphereFolder.open();

/**
 * Animate
 */
const clock = new THREE.Clock();
let ghostTime = 0;

const tick = () => {
  const deltaTime = Math.min(clock.getDelta(), 0.1);
  // Accumulate only active animation time so pausing or changing speed never jumps.
  if (sceneSettings.animateGhosts) ghostTime += deltaTime * sceneSettings.ghostSpeed;
  const elapsedTime = ghostTime;

  // Update controls
  controls.update(deltaTime);

  //ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.5;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.23));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.5);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
