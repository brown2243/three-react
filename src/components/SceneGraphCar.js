import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import RendererBox from "./RendererBox";

function SceneGraphCar() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xaaaaaa);

    const fov = 40;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(8, 4, 10);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
    {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, -2, -4);
      scene.add(light);
    }

    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    scene.add(bodyMesh);

    const wheelRadius = 1;
    const wheelThickness = 0.5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius, // top radius
      wheelRadius, // bottom radius
      wheelThickness, // height of cylinder
      wheelSegments
    );
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wheelPositions = [
      [-carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    const wheelMeshes = wheelPositions.map((position) => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(...position);
      mesh.rotation.z = Math.PI * 0.5;
      scene.add(mesh);
      return mesh;
    });

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    // const carPosition = [0, 0, 0];

    function render(time) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      wheelMeshes.forEach((obj) => {
        obj.rotation.x = time;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default SceneGraphCar;
