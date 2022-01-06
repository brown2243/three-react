import React, { useEffect, useRef } from "react";
import RendererBox from "./RendererBox";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { resizeRendererToDisplaySize } from "../utils/snippet";
import styled from "styled-components";

const SplitView = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  & > div {
    width: 100%;
    height: 100%;
  }
`;

function CameraOrthographic() {
  const canvasRef = useRef(null);
  const cameraOne = useRef(null);
  const cameraTwo = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    const view1Elem = cameraOne.current;
    const view2Elem = cameraTwo.current;

    const left = -1;
    const right = 1;
    const top = 1;
    const bottom = -1;
    const near = 5;
    const far = 50;
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );

    camera.zoom = 0.2;
    camera.position.set(0, 10, 20);

    const cameraHelper = new THREE.CameraHelper(camera);

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

    const gui = new GUI();
    gui.add(camera, "zoom", 0.01, 1, 0.01).listen();
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
    gui.add(minMaxGUIHelper, "min", 0.1, 50, 0.1).name("near");
    gui.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far");

    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();

    const camera2 = new THREE.PerspectiveCamera(
      60, // fov
      2, // aspect
      0.1, // near
      500 // far
    );
    camera2.position.set(16, 28, 40);
    camera2.lookAt(0, 5, 0);

    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");
    scene.add(cameraHelper);

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
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
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
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      scene.add(mesh);
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

    function setScissorForElement(elem) {
      const canvasRect = canvas.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();

      // compute a canvas relative rectangle
      const right =
        Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
      const left = Math.max(0, elemRect.left - canvasRect.left);
      const bottom =
        Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
      const top = Math.max(0, elemRect.top - canvasRect.top);

      const width = Math.min(canvasRect.width, right - left);
      const height = Math.min(canvasRect.height, bottom - top);

      // setup the scissor to only render to that part of the canvas
      const positiveYUpBottom = canvasRect.height - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);

      // return the aspect
      return width / height;
    }

    // turn on the scissor
    renderer.setScissorTest(true);
    function render() {
      resizeRendererToDisplaySize(renderer);
      // render the original view
      {
        const aspect = setScissorForElement(view1Elem);
        // adjust the camera for this aspect
        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();
        cameraHelper.update();
        // don't draw the camera helper in the original view
        cameraHelper.visible = false;
        // render
        scene.background.set(0x000000);
        renderer.render(scene, camera);
      }

      // render from the 2nd camera
      {
        const aspect = setScissorForElement(view2Elem);

        // adjust the camera for this aspect
        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();

        // draw the camera helper in the 2nd view
        cameraHelper.visible = true;

        scene.background.set(0x000040);

        renderer.render(scene, camera2);
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function destroyGui() {
      gui.destroy();
    }
    return destroyGui;
  }, []);

  return (
    <>
      <RendererBox canvasRef={canvasRef} />
      <SplitView>
        <div ref={cameraOne} tabIndex="1"></div>
        <div ref={cameraTwo} tabIndex="2"></div>
      </SplitView>
    </>
  );
}

export default CameraOrthographic;
