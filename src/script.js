import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";

const params = {
  side: THREE.BackSide,
};

function initScene(isWebGPU) {
  /**
   * Scene
   */
  const canvas = document.querySelector(
    isWebGPU ? "canvas.webgpu" : "canvas.webgl"
  );
  const scene = new THREE.Scene();

  /**
   * ScreenResolution
   */
  const screenRes = {
    width: window.innerWidth,
    height: window.innerHeight / 2,
  };

  window.addEventListener("resize", () => {
    screenRes.width = window.innerWidth;
    screenRes.height = window.innerHeight / 2;

    camera.aspect = screenRes.width / screenRes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(screenRes.width, screenRes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  });

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(
    35,
    screenRes.width / screenRes.height,
    1,
    1000
  );
  camera.position.set(0, 0, 6);
  scene.add(camera);

  /**
   * Controls
   */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 8;
  controls.minDistance = 2;
  controls.maxPolarAngle = Math.PI / 1.7;
  controls.minPolarAngle = 1.1;
  controls.autoRotate = true;
  controls.target.set(0, -0.3, 0);

  /**
   * Lights
   */
  const light = new THREE.DirectionalLight();
  light.intensity = 1;
  light.position.set(-20, 20, 50);
  scene.add(light);

  // const dirLightHelper = new THREE.DirectionalLightHelper( light, 10000000, 0xffffff );
  // scene.add( dirLightHelper );

  const ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.1;
  scene.add(ambientLight);

  /**
   * Renderer
   */
  const renderer = new (isWebGPU ? WebGPURenderer : THREE.WebGLRenderer)({
    canvas: canvas,
    powerPreference: "high-performance",
    antialias: true,
  });

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setSize(screenRes.width, screenRes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

  /**
   * SkyBox
   */
  const geometry = new THREE.SphereGeometry(1, 40, 40);
  const texture = new THREE.TextureLoader().load("background2.jpg");
  texture.flipY = true;
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: params.side,
  });

  const skyBox = new THREE.Mesh(geometry, material);
  scene.add(skyBox);
  skyBox.rotation.y = -1;

  const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  return material;
}

const webgpu = initScene(true);
const webgl = initScene(false);

/**
 * Set up the GUI for manipulating parameters
 */
const gui = new dat.GUI();

gui
  .add(params, "side")
  .options([THREE.FrontSide, THREE.BackSide, THREE.DoubleSide])
  .onChange((side) => {
    console.log(side);
    webgpu.side = side;
    webgl.side = side;
    webgpu.needsUpdate = true;
    webgl.needsUpdate = true;
  })
  .name("side");
// gui
//   .add(params, 'glowInternalRadius')
//   .min(-10)
//   .max(10)
//   .step(0.01)
//   .onChange((glowInternalRadius) => {
//     fakeGlowMaterial.uniforms.glowInternalRadius.value = glowInternalRadius;
//     fakeGlowMaterialWebGPU.uGlowInternalRadius.value = glowInternalRadius;
//   })
//   .name('Glow Internal Radius');
// gui
//   .addColor(
//     {
//       GlowColor: params.glowColor.getStyle()
//     },
//     'GlowColor'
//   )
//   .onChange((color) => {
//     fakeGlowMaterial.uniforms.glowColor.value.setStyle(color);
//     fakeGlowMaterialWebGPU.uGlowColor.value = new THREE.Color(color);
//   })
//   .name('Glow Color');
// gui
//   .add(params, 'glowSharpness')
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .onChange((glowSharpness) => {
//     fakeGlowMaterial.uniforms.glowSharpness.value = glowSharpness;
//     fakeGlowMaterialWebGPU.uGlowSharpness.value = glowSharpness;
//   })
//   .name('Glow Sharpness');
// gui
//   .add(params, 'opacity')
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .onChange((opacity) => {
//     fakeGlowMaterial.uniforms.opacity.value = opacity;
//     fakeGlowMaterialWebGPU.uOpacity.value = opacity;
//   })
//   .name('Opacity');

// gui
//   .add(params, 'toneMappingExposure')
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .onChange((toneMappingExposure) => {
//     // fakeGlowMaterialWebGPU.uToneMappingExposure.value = toneMappingExposure;
//     webgpu.toneMappingExposure = toneMappingExposure;
//     webgl.toneMappingExposure = toneMappingExposure;
//   })
//   .name('ToneMappingExposure');
