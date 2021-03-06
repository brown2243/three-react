import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import { resizeOptimization } from "utils/snippet";
import GUI from "lil-gui";

function TexturesController() {
  const canvasRef = useRef(null);

  useEffect(() => {
    class DegRadHelper {
      constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
      }
      get value() {
        return THREE.MathUtils.radToDeg(this.obj[this.prop]);
      }
      set value(v) {
        this.obj[this.prop] = THREE.MathUtils.degToRad(v);
      }
    }
    class StringToNumberHelper {
      constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
      }
      get value() {
        return this.obj[this.prop];
      }
      set value(v) {
        this.obj[this.prop] = parseFloat(v);
      }
    }
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = []; // just an array we can use to rotate the cubes
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/wall.jpg"
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    const cube = new THREE.Mesh(geometry, material);

    const wrapModes = {
      ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      RepeatWrapping: THREE.RepeatWrapping,
      MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
    };

    function updateTexture() {
      texture.needsUpdate = true;
    }
    const gui = new GUI();
    gui
      .add(new StringToNumberHelper(texture, "wrapS"), "value", wrapModes)
      .name("texture.wrapS")
      .onChange(updateTexture);
    gui
      .add(new StringToNumberHelper(texture, "wrapT"), "value", wrapModes)
      .name("texture.wrapT")
      .onChange(updateTexture);
    gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
    gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
    gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
    gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
    gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
    gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");
    gui
      .add(new DegRadHelper(texture, "rotation"), "value", -360, 360)
      .name("texture.rotation");

    scene.add(cube);
    cubes.push(cube); // add to our list of cubes to rotate

    function render(time) {
      time *= 0.001;
      resizeOptimization(renderer, camera);

      cubes.forEach((cube, ndx) => {
        const speed = 0.2 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    function destroyGui() {
      gui.destroy();
    }
    return destroyGui;
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default TexturesController;
