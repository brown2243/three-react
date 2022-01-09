import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { resizeOptimization } from "utils/snippet";

function CameraZfighting() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      logarithmicDepthBuffer: true, // z-fighting 임시방편
    });

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.00001;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(10, 6, 10);

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

    function updateCamera() {
      camera.updateProjectionMatrix();
    }

    const gui = new GUI();
    gui.add(camera, "fov", 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
    gui
      .add(minMaxGUIHelper, "min", 0.00001, 50, 0.00001)
      .name("near")
      .onChange(updateCamera);
    gui
      .add(minMaxGUIHelper, "max", 0.1, 50, 0.1)
      .name("far")
      .onChange(updateCamera);

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
      mesh.rotation.x = Math.PI * -0.5;
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
      const numSpheres = 20;
      for (let i = 0; i < numSpheres; ++i) {
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(i * 0.73, 1, 0.5);
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(
          -sphereRadius - 1,
          sphereRadius + 2,
          i * sphereRadius * -2.2
        );
        scene.add(mesh);
      }
    }

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 0);
      light.target.position.set(-5, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }

    function render() {
      resizeOptimization(renderer, camera);
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

export default CameraZfighting;
