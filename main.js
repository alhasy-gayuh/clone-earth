import gsap from "gsap";
import "./style.css";
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";
import { Float32BufferAttribute } from "three";

const canvasContainer = document.querySelector("#canvasContainer");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
);
scene.background = new THREE.Color(0x000000);
const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: document.querySelector("canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
camera.position.z = 15;

// texture map
const globe = new THREE.TextureLoader().load("/img/OIP.jpg");

// Buat Sphere
const geometry = new THREE.SphereGeometry(5, 50, 50);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        globeTexture: {
            value: globe,
        },
    },
});
const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere); // ini gak di perlukan lagi karna sudah pakek gruping di bawah

// Buat Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
});
const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// Buat bintang - bintang
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

// generate bintang - bintang
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 4000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// grouping scene >> memang ada di threejs
const group = new THREE.Group();
group.add(sphere);
scene.add(group);

// menyimpan gerakan mouse
const mouse = {
    x: undefined,
    y: undefined,
};

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.002;
    gsap.to(group.rotation, {
        x: -mouse.y * 0.5,
        y: mouse.x * 0.5,
        duration: 2,
    });

    renderer.render(scene, camera);
}
animate();

// event untuk gerakan mouse
addEventListener("mousemove", () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
