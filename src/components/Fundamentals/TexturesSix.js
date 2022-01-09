import React, { useEffect, useRef } from "react";
import RendererBox from "../RendererBox";
import * as THREE from "three";
import { resizeOptimization } from "utils/snippet";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  #loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #loading .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
  }
  #loading .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
  }
`;

function TexturesSix() {
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

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [];
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const materials = [
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-1.jpg"
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-2.jpg"
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-3.jpg"
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-4.jpg"
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-5.jpg"
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load(
          "https://threejs.org/manual/examples/resources/images/flower-6.jpg"
        ),
      }),
    ];

    const loadingElem = document.querySelector("#loading");
    const progressBarElem = loadingElem.querySelector(".progressbar");

    loadManager.onLoad = () => {
      loadingElem.style.display = "none";
      const cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);
      cubes.push(cube); // 회전 애니메이션을 위해 배열에 추가
    };

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
      // 마지막으로 불러온 자원의 URL, 현재까지 불러온 자원의 수, 총 지원의 수
      const progress = itemsLoaded / itemsTotal;
      progressBarElem.style.transform = `scaleX(${progress})`;
    };

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
  }, []);

  return (
    <Container>
      <RendererBox canvasRef={canvasRef} />
      <div id="loading">
        <div className="progress">
          <div className="progressbar"></div>
        </div>
      </div>
    </Container>
  );
}

export default TexturesSix;
