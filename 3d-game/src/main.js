// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// // Scene
// const scene = new THREE.Scene();

// // Grid
// const grid = new THREE.GridHelper(100, 100);
// scene.add(grid);

// // Camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 2, 5);

// // Renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Light
// const ambient = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambient);
// const directional = new THREE.DirectionalLight(0xffffff, 1);
// directional.position.set(3, 10, 5);
// scene.add(directional);

// // Load Model + Animation
// const loader = new GLTFLoader();
// let model, mixer, action;
// const clock = new THREE.Clock();

// loader.load('/models/Person_walk.glb', (gltf) => {
//   model = gltf.scene;
//   model.scale.set(1, 1, 1);
//   model.position.set(0, 0, 0);
//   scene.add(model);

//   // Animation setup
//   mixer = new THREE.AnimationMixer(model);
//   const clip = gltf.animations.find(a => a.name === "Armature|mixamo.com|Layer0");
//   if (clip) {
//      action = mixer.clipAction(clip);
//   action.setLoop(THREE.LoopRepeat, Infinity);
//   action.clampWhenFinished = true;
//   action.play();
//   }

//   console.log("Model and animation loaded.");
// }, undefined, (error) => {
//   console.error("Error loading model:", error);
// });

// // Movement
// const keys = {};
// window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
// window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// // Animate
// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta();
//   if (mixer) mixer.update(delta);

// if (model && action) {
//   const speed = 2;
//   const rotateSpeed = 2;

//   let moving = false;

//   // Movement
//   if (keys['w']) {
//     model.translateZ(speed * delta);
//     moving = true;
//     action.timeScale = 1; // Play animation forward
//   }
//   if (keys['s']) {
//     model.translateZ(-speed * delta);
//     moving = true;
//     action.timeScale = -1; // Play animation reversed

//     // If animation at start, jump to end to play backward smoothly
//     if (action.time <= 0) {
//       action.time = action.getClip().duration;
//     }
//   }

//   // Rotation
//   if (keys['a']) {
//     model.rotation.y += rotateSpeed * delta;
//     moving = true;
//   }
//   if (keys['d']) {
//     model.rotation.y -= rotateSpeed * delta;
//     moving = true;
//   }

//   // Start or stop animation based on movement
//   if (moving) {
//     if (!action.isRunning()) action.play();
//   } else {
//     action.stop();
//   }

//   // Camera follows model from behind with smoothing
//   const relativeCameraOffset = new THREE.Vector3(0, 2, -5);
//   const cameraOffset = relativeCameraOffset.applyMatrix4(model.matrixWorld);

//   camera.position.lerp(cameraOffset, 0.1);
//   camera.lookAt(model.position);
// }

//   renderer.render(scene, camera);
// }
// animate();




import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Grid
const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(3, 10, 5);
scene.add(directional);

// Load Model + Animation
const loader = new GLTFLoader();
let model, mixer, action;
const clock = new THREE.Clock();

loader.load('/models/Person_walk.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const clip = gltf.animations.find(a => a.name === "Armature|mixamo.com|Layer0");
  if (clip) {
    action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = true;
    action.play();
  }

  console.log("Model and animation loaded.");
}, undefined, (error) => {
  console.error("Error loading model:", error);
});

// Input
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Mouse camera control
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;

document.body.addEventListener('click', () => {
  document.body.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    yaw -= event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;
    pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch)); // clamp
  }
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  if (model && action) {
    const speed = 3;
    let moving = false;

    // Direction vectors based on yaw
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDir = new THREE.Vector3();

    if (keys['w']) {
      moveDir.add(forward);
      moving = true;
      action.timeScale = 1;
    }
    if (keys['s']) {
      moveDir.sub(forward);
      moving = true;
      action.timeScale = -1;
      if (action.time <= 0) action.time = action.getClip().duration;
    }
    if (keys['a']) {
      moveDir.sub(right);
      moving = true;
    }
    if (keys['d']) {
      moveDir.add(right);
      moving = true;
    }

    moveDir.normalize();
    model.position.addScaledVector(moveDir, speed * delta);

    // Model face direction of movement
   if (moving) {
  // Check if moving forward or sideways (excluding backward)
  const forwardOrSideKeys = keys['w'] || keys['a'] || keys['d'];
  
  if (forwardOrSideKeys) {
    // Calculate rotation based only on forward & sideways input
    // Let's build a separate direction vector for rotation ignoring backward
    
    const rotDir = new THREE.Vector3();

    if (keys['w']) rotDir.add(forward);
    if (keys['a']) rotDir.sub(right);
    if (keys['d']) rotDir.add(right);

    rotDir.normalize();

    // Only update rotation if rotDir is not zero vector
    if (rotDir.lengthSq() > 0) {
      const targetAngle = Math.atan2(rotDir.x, rotDir.z);
      model.rotation.y = targetAngle;
    }
  }
  // else (only S pressed), don't update rotation
  
  if (!action.isRunning()) action.play();
} else {
  action.stop();
}


    // Camera follows behind
    const radius = 5;
    const camX = model.position.x + Math.sin(yaw) * Math.cos(pitch) * radius;
    const camY = model.position.y + Math.sin(pitch) * radius + 2;
    const camZ = model.position.z + Math.cos(yaw) * Math.cos(pitch) * radius;

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.1);
    camera.lookAt(model.position);
  }

  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
