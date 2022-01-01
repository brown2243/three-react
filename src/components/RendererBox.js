import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { ANI_OBJ, SCENE_GRAPH_OBJ } from "./sceneGraph";

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
  const [aniObj, setAniObj] = useState([]);
  useEffect(() => {
    setObjs(SCENE_GRAPH_OBJ);
    setAniObj(ANI_OBJ);
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

      aniObj.forEach((obj) => (obj.rotation.y = time));

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, [objs, aniObj]);

  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
    </Container>
  );
}

export default RendererBox;
