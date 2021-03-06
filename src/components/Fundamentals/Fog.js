import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import { resizeOptimization } from "utils/snippet";
import GUI from "lil-gui";

function Fog() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    {
      const near = 1;
      const far = 2;
      const color = "lightblue";
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    }

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({ color });

      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      cube.position.x = x;

      return cube;
    }

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844, 2),
    ];

    class FogGUIHelper {
      constructor(fog, backgroundColor) {
        this.fog = fog;
        this.backgroundColor = backgroundColor;
      }
      get near() {
        return this.fog.near;
      }
      set near(v) {
        this.fog.near = v;
        this.fog.far = Math.max(this.fog.far, v);
      }
      get far() {
        return this.fog.far;
      }
      set far(v) {
        this.fog.far = v;
        this.fog.near = Math.min(this.fog.near, v);
      }
      get color() {
        return `#${this.fog.color.getHexString()}`;
      }
      set color(hexString) {
        this.fog.color.set(hexString);
        this.backgroundColor.set(hexString);
      }
    }
    const gui = new GUI();
    function destroyGui() {
      gui.destroy();
    }
    {
      const near = 1;
      const far = 2;
      const color = "lightblue";
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);

      const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
      gui.add(fogGUIHelper, "near", near, far).listen();
      gui.add(fogGUIHelper, "far", near, far).listen();
      gui.addColor(fogGUIHelper, "color");
    }
    function render(time) {
      time *= 0.001;
      resizeOptimization(renderer, camera);

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    return destroyGui;
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default Fog;
