import React, { useEffect, useRef, useState } from "react";
import GUI from "lil-gui";
import * as THREE from "three";
import RendererBox from "./RendererBox";
import { resizeOptimization } from "../utils/snippet";

function SceneGraph() {
  const canvasRef = useRef(null);

  const [objs, setObjs] = useState([]);
  const [aniObj, setAniObj] = useState([]);

  useEffect(() => {
    // 하나의 geometry로 모든 태양, 지구, 달을 생성
    const SCENE_GRAPH_OBJ = [];
    const ANI_OBJ = [];

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    //
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 태양의 크기를 키움
    // 이는 sunMesh의 "지역 공간" 자체를 5배 키우겠다는 의미입니다.
    // 그래서 지구의 크기도 5배가 되었고, 거리(earthMesh.position.x = 10)도 5배로 적용된 것이죠.
    //
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    const solarSystem = new THREE.Object3D();
    //
    solarSystem.add(sunMesh);
    solarSystem.add(earthMesh);
    solarSystem.add(earthOrbit);
    class AxisGridHelper {
      constructor(node, units = 10) {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2; // 격자 다음에 렌더링
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = false;
      }
      get visible() {
        return this._visible;
      }
      set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
      }
    }
    const gui = new GUI();
    function makeAxisGrid(node, label, units) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, "visible").name(label);
    }

    makeAxisGrid(solarSystem, "solarSystem", 25);
    makeAxisGrid(sunMesh, "sunMesh");
    makeAxisGrid(earthOrbit, "earthOrbit");
    makeAxisGrid(earthMesh, "earthMesh");
    makeAxisGrid(moonMesh, "moonMesh");

    SCENE_GRAPH_OBJ.push(solarSystem);
    ANI_OBJ.push(solarSystem, sunMesh, earthMesh, earthOrbit, moonMesh);

    setObjs(SCENE_GRAPH_OBJ);
    setAniObj(ANI_OBJ);
    function destroyGui() {
      gui.destroy();
    }
    return destroyGui;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();

    // Camera
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(0, 30, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    // Light
    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.PointLight(color, intensity);
      scene.add(light);
    }

    objs.forEach((obj) => scene.add(obj));

    renderer.render(scene, camera);
    function render(time) {
      time *= 0.001; // convert time to seconds

      resizeOptimization(renderer, camera);
      aniObj.forEach((obj) => (obj.rotation.y = time));

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, [objs, aniObj]);

  return <RendererBox canvasRef={canvasRef} />;
}
export default SceneGraph;
