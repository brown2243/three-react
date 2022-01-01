import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { saveData } from "./primitives";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  & > canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

function RendererBox() {
  const canvasRef = useRef(null);
  const [objs, setObjs] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await saveData();
      setObjs(data);
    })();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const fov = 40;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 200;

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    objs.forEach((obj) => scene.add(obj));

    renderer.render(scene, camera);
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time) {
      time *= 0.001; // convert time to seconds

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      scene.children.forEach((mesh, ndx) => {
        const speed = 1 + ndx * 0.01;
        const rot = time * speed;
        mesh.rotation.x = rot;
        mesh.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, [objs]);

  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
    </Container>
  );
}

export default RendererBox;
