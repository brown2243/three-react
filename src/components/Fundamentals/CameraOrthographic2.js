import React, { useEffect, useRef } from "react";
import RendererBox from "components/RendererBox";
import * as THREE from "three";
import { resizeRendererToDisplaySize } from "utils/snippet";

function CameraOrthographic2() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const left = 0;
    const right = 300; // default canvas size
    const top = 0;
    const bottom = 150; // defautl canvas size
    const near = -1;
    const far = 1;
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );
    camera.zoom = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    const loader = new THREE.TextureLoader();
    const textures = [
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-1.jpg"
      ),
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-2.jpg"
      ),
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-3.jpg"
      ),
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-4.jpg"
      ),
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-5.jpg"
      ),
      loader.load(
        "https://threejs.org/manual/examples/resources/images/flower-6.jpg"
      ),
    ];
    const planeSize = 256;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

    const planes = textures.map((texture) => {
      const planePivot = new THREE.Object3D();
      scene.add(planePivot);
      texture.magFilter = THREE.NearestFilter;
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      planePivot.add(mesh);
      // move plane so top left corner is origin
      mesh.position.set(planeSize / 2, planeSize / 2, 0);
      return planePivot;
    });

    function render(time) {
      time *= 0.001; // convert to seconds;

      if (resizeRendererToDisplaySize(renderer)) {
        camera.right = canvas.width;
        camera.bottom = canvas.height;
        camera.updateProjectionMatrix();
      }

      const distAcross = Math.max(20, canvas.width - planeSize);
      const distDown = Math.max(20, canvas.height - planeSize);

      // total distance to move across and back
      const xRange = distAcross * 2;
      const yRange = distDown * 2;
      const speed = 180;

      planes.forEach((plane, ndx) => {
        // compute a unique time for each plane
        const t = time * speed + ndx * 100;

        // get a value between 0 and range
        const xt = t % xRange;
        const yt = t % yRange;

        // set our position going forward if 0 to half of range
        // and backward if half of range to range
        const x = xt < distAcross ? xt : xRange - xt;
        const y = yt < distDown ? yt : yRange - yt;

        plane.position.set(x, y, 0);
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return <RendererBox canvasRef={canvasRef} />;
}

export default CameraOrthographic2;
