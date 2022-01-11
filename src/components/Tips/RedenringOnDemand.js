import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import { resizeOptimization } from "utils/snippet";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

function RedenringOnDemand() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2; // canvas 기본값
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enableDamping = true;

    const scene = new THREE.Scene();
    const gui = new GUI();

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
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
      const folder = gui.addFolder(`Cube${x}`);
      folder
        .addColor(new ColorGUIHelper(material, "color"), "value")
        .name("color")
        .onChange(requestRenderIfNotRequested);
      folder
        .add(cube.scale, "x", 0.1, 1.5)
        .name("scale x")
        .onChange(requestRenderIfNotRequested);
      folder.open();
      return cube;
    }

    makeInstance(geometry, 0x44aa88, 0);
    makeInstance(geometry, 0x8844aa, -2);
    makeInstance(geometry, 0xaa8844, 2);

    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    let renderRequested = false;
    function render() {
      renderRequested = undefined;
      resizeOptimization(renderer, camera);
      controls.update();

      renderer.render(scene, camera);
    }
    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }
    render();

    return () => {
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default RedenringOnDemand;
