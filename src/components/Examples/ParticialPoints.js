import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
// import Stats from "three/examples/jsm/libs/stats.module.js";
// import * as THREE from "three";
// import { resizeOptimization } from "utils/snippet";

function ParticialPoints() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // const renderer = new THREE.WebGLRenderer({ canvas });
    // const camera = new THREE.PerspectiveCamera(40, 2, 1, 10000);
    // camera.position.z = 300;
    // const scene = new THREE.Scene();
    // const amount = 100000;
    // const radius = 200;
    // const positions = new Float32Array(amount * 3);
    // const colors = new Float32Array(amount * 3);
    // const sizes = new Float32Array(amount);
    // const vertex = new THREE.Vector3();
    // const color = new THREE.Color(0xffffff);
    // for (let i = 0; i < amount; i++) {
    //   vertex.x = (Math.random() * 2 - 1) * radius;
    //   vertex.y = (Math.random() * 2 - 1) * radius;
    //   vertex.z = (Math.random() * 2 - 1) * radius;
    //   vertex.toArray(positions, i * 3);
    //   if (vertex.x < 0) {
    //     color.setHSL(0.5 + 0.1 * (i / amount), 0.7, 0.5);
    //   } else {
    //     color.setHSL(0.0 + 0.1 * (i / amount), 0.9, 0.5);
    //   }
    //   color.toArray(colors, i * 3);
    //   sizes[i] = 10;
    // }
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    // geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    // const material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     color: { value: new THREE.Color(0xffffff) },
    //     pointTexture: {
    //       value: new THREE.TextureLoader().load("textures/sprites/spark1.png"),
    //     },
    //   },
    //   vertexShader: document.getElementById("vertexshader").textContent,
    //   fragmentShader: document.getElementById("fragmentshader").textContent,
    //   blending: THREE.AdditiveBlending,
    //   depthTest: false,
    //   transparent: true,
    // });
    // //
    // const sphere = new THREE.Points(geometry, material);
    // scene.add(sphere);
    // //
    // renderer.setPixelRatio(window.devicePixelRatio);
    // // renderer.setSize( WIDTH, HEIGHT );
    // const container = document.getElementById("container");
    // container.appendChild(renderer.domElement);
    // const stats = new Stats();
    // container.appendChild(stats.dom);
    // //
    // function render(time) {
    //   time *= 0.001;
    //   resizeOptimization(renderer, camera);
    //   sphere.rotation.z = 0.01 * time;
    //   const geometry = sphere.geometry;
    //   const attributes = geometry.attributes;
    //   for (let i = 0; i < attributes.size.array.length; i++) {
    //     attributes.size.array[i] = 14 + 13 * Math.sin(0.1 * i + time);
    //   }
    //   attributes.size.needsUpdate = true;
    //   renderer.render(scene, camera);
    //   stats.update();
    //   requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default ParticialPoints;
