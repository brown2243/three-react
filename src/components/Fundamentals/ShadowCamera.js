import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import { resizeOptimization } from "utils/snippet";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

function ShadowCamera() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    {
      const planeSize = 40;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        "https://threejs.org/manual/examples/resources/images/checker.png"
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);
    }
    {
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      scene.add(mesh);
    }
    {
      const cubeSize = 30;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({
        color: "#CCC",
        side: THREE.BackSide,
      });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.receiveShadow = true;
      mesh.position.set(0, cubeSize / 2 - 0.1, 0);
      scene.add(mesh);
    }
    {
      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthDivisions,
        sphereHeightDivisions
      );
      const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(mesh);
    }

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

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
      const folder = gui.addFolder(name);
      folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
      folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
      folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
      // folder.open();
    }
    const gui = new GUI();
    function destroyGui() {
      gui.destroy();
    }
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.PointLight(color, intensity);
      light.castShadow = true;
      light.position.set(0, 10, 0);
      scene.add(light);

      const helper = new THREE.PointLightHelper(light);
      scene.add(helper);

      function updateCamera() {}

      class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
          this.obj = obj;
          this.minProp = minProp;
          this.maxProp = maxProp;
          this.minDif = minDif;
        }
        get min() {
          return this.obj[this.minProp];
        }
        set min(v) {
          this.obj[this.minProp] = v;
          this.obj[this.maxProp] = Math.max(
            this.obj[this.maxProp],
            v + this.minDif
          );
        }
        get max() {
          return this.obj[this.maxProp];
        }
        set max(v) {
          this.obj[this.maxProp] = v;
          this.min = this.min; // this will call the min setter
        }
      }

      gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
      gui.add(light, "intensity", 0, 2, 0.01);
      gui.add(light, "distance", 0, 40).onChange(updateCamera);

      {
        const folder = gui.addFolder("Shadow Camera");
        folder.open();
        const minMaxGUIHelper = new MinMaxGUIHelper(
          light.shadow.camera,
          "near",
          "far",
          0.1
        );
        folder
          .add(minMaxGUIHelper, "min", 0.1, 50, 0.1)
          .name("near")
          .onChange(updateCamera);
        folder
          .add(minMaxGUIHelper, "max", 0.1, 50, 0.1)
          .name("far")
          .onChange(updateCamera);
      }

      makeXYZGUI(gui, light.position, "position", updateCamera);
    }

    function render(time) {
      resizeOptimization(renderer, camera);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    return destroyGui;
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default ShadowCamera;
