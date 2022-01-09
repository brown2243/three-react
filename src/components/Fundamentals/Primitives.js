import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as THREELOADER from "three/examples/jsm/loaders/FontLoader.js";
import * as THREETEXT from "three/examples/jsm/geometries/TextGeometry.js";

import RendererBox from "../RendererBox";
import { resizeOptimization } from "utils/snippet";

function Primitives() {
  const canvasRef = useRef(null);
  const [meshObjs, setMeshObjs] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await saveData([]);
      setMeshObjs([...data]);
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

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    meshObjs.forEach((obj) => scene.add(obj));
    renderer.render(scene, camera);

    function render(time) {
      time *= 0.001; // convert time to seconds
      resizeOptimization(renderer, camera);

      meshObjs.forEach((mesh, ndx) => {
        const speed = 1 + ndx * 0.01;
        const rot = time * speed;
        mesh.rotation.x = rot;
        mesh.rotation.y = rot;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, [meshObjs]);

  return <RendererBox canvasRef={canvasRef} />;
}

export default Primitives;

async function saveData(objects) {
  const primitivesBox = [];

  {
    const width = 8; // ui: width
    const height = 8; // ui: height
    const depth = 8; // ui: depth
    const geometry = new THREE.BoxGeometry(width, height, depth);
    primitivesBox.push(geometry);
  }
  {
    const width = 8; // ui: width
    const height = 8; // ui: height
    const depth = 8; // ui: depth
    const widthSegments = 4; // ui: widthSegments
    const heightSegments = 4; // ui: heightSegments
    const depthSegments = 4; // ui: depthSegments
    const geometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const segments = 24; // ui: segments
    const geometry = new THREE.CircleGeometry(radius, segments);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const segments = 24; // ui: segments
    const thetaStart = Math.PI * 0.25; // ui: thetaStart
    const thetaLength = Math.PI * 1.5; // ui: thetaLength
    const geometry = new THREE.CircleGeometry(
      radius,
      segments,
      thetaStart,
      thetaLength
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 6; // ui: radius
    const height = 8; // ui: height
    const radialSegments = 16; // ui: radialSegments
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    primitivesBox.push(geometry);
  }
  {
    const radius = 6; // ui: radius
    const height = 8; // ui: height
    const radialSegments = 16; // ui: radialSegments
    const heightSegments = 2; // ui: heightSegments
    const openEnded = true; // ui: openEnded
    const thetaStart = Math.PI * 0.25; // ui: thetaStart
    const thetaLength = Math.PI * 1.5; // ui: thetaLength
    const geometry = new THREE.ConeGeometry(
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength
    );
    primitivesBox.push(geometry);
  }
  {
    const radiusTop = 4; // ui: radiusTop
    const radiusBottom = 4; // ui: radiusBottom
    const height = 8; // ui: height
    const radialSegments = 12; // ui: radialSegments
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const radiusTop = 4; // ui: radiusTop
    const radiusBottom = 4; // ui: radiusBottom
    const height = 8; // ui: height
    const radialSegments = 12; // ui: radialSegments
    const heightSegments = 2; // ui: heightSegments
    const openEnded = false; // ui: openEnded
    const thetaStart = Math.PI * 0.25; // ui: thetaStart
    const thetaLength = Math.PI * 1.5; // ui: thetaLength
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.DodecahedronGeometry(radius);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const detail = 2; // ui: detail
    const geometry = new THREE.DodecahedronGeometry(radius, detail);
    primitivesBox.push(geometry);
  }
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 2, // ui: steps
      depth: 2, // ui: depth
      bevelEnabled: true, // ui: bevelEnabled
      bevelThickness: 1, // ui: bevelThickness
      bevelSize: 1, // ui: bevelSize
      bevelSegments: 2, // ui: bevelSegments
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    primitivesBox.push(geometry);
  }
  {
    const outline = new THREE.Shape(
      [
        [-2, -0.1],
        [2, -0.1],
        [2, 0.6],
        [1.6, 0.6],
        [1.6, 0.1],
        [-2, 0.1],
      ].map((p) => new THREE.Vector2(...p))
    );

    const x = -2.5;
    const y = -5;
    const shape = new THREE.CurvePath();
    const points = [
      [x + 2.5, y + 2.5],
      [x + 2.5, y + 2.5],
      [x + 2, y],
      [x, y],
      [x - 3, y],
      [x - 3, y + 3.5],
      [x - 3, y + 3.5],
      [x - 3, y + 5.5],
      [x - 1.5, y + 7.7],
      [x + 2.5, y + 9.5],
      [x + 6, y + 7.7],
      [x + 8, y + 4.5],
      [x + 8, y + 3.5],
      [x + 8, y + 3.5],
      [x + 8, y],
      [x + 5, y],
      [x + 3.5, y],
      [x + 2.5, y + 2.5],
      [x + 2.5, y + 2.5],
    ].map((p) => new THREE.Vector3(...p, 0));
    for (let i = 0; i < points.length; i += 3) {
      shape.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
    }

    const extrudeSettings = {
      steps: 100, // ui: steps
      bevelEnabled: false,
      extrudePath: shape,
    };

    const geometry = new THREE.ExtrudeGeometry(outline, extrudeSettings);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.IcosahedronGeometry(radius);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const detail = 2; // ui: detail
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    primitivesBox.push(geometry);
  }
  {
    const points = [];
    for (let i = 0; i < 10; ++i) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
    }
    const geometry = new THREE.LatheGeometry(points);
    primitivesBox.push(geometry);
  }
  {
    const points = [];
    for (let i = 0; i < 10; ++i) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
    }
    const segments = 12; // ui: segments
    const phiStart = Math.PI * 0.25; // ui: phiStart
    const phiLength = Math.PI * 1.5; // ui: phiLength
    const geometry = new THREE.LatheGeometry(
      points,
      segments,
      phiStart,
      phiLength
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.OctahedronGeometry(radius);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const detail = 2; // ui: detail
    const geometry = new THREE.OctahedronGeometry(radius, detail);
    primitivesBox.push(geometry);
  }
  {
    const width = 9; // ui: width
    const height = 9; // ui: height
    const geometry = new THREE.PlaneGeometry(width, height);
    primitivesBox.push(geometry);
  }
  {
    const width = 9; // ui: width
    const height = 9; // ui: height
    const widthSegments = 2; // ui: widthSegments
    const heightSegments = 2; // ui: heightSegments
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const verticesOfCube = [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1,
    ];
    const indicesOfFaces = [
      2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
      3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
    ];
    const radius = 7; // ui: radius
    const detail = 2; // ui: detail
    const geometry = new THREE.PolyhedronGeometry(
      verticesOfCube,
      indicesOfFaces,
      radius,
      detail
    );
    primitivesBox.push(geometry);
  }
  {
    const innerRadius = 2; // ui: innerRadius
    const outerRadius = 7; // ui: outerRadius
    const thetaSegments = 18; // ui: thetaSegments
    const geometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      thetaSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const innerRadius = 2; // ui: innerRadius
    const outerRadius = 7; // ui: outerRadius
    const thetaSegments = 18; // ui: thetaSegments
    const phiSegments = 2; // ui: phiSegments
    const thetaStart = Math.PI * 0.25; // ui: thetaStart
    const thetaLength = Math.PI * 1.5; // ui: thetaLength
    const geometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      thetaSegments,
      phiSegments,
      thetaStart,
      thetaLength
    );
    primitivesBox.push(geometry);
  }
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    const geometry = new THREE.ShapeGeometry(shape);
    primitivesBox.push(geometry);
  }
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    const curveSegments = 5; // ui: curveSegments
    const geometry = new THREE.ShapeGeometry(shape, curveSegments);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const widthSegments = 12; // ui: widthSegments
    const heightSegments = 8; // ui: heightSegments
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const widthSegments = 12; // ui: widthSegments
    const heightSegments = 8; // ui: heightSegments
    const phiStart = Math.PI * 0.25; // ui: phiStart
    const phiLength = Math.PI * 1.5; // ui: phiLength
    const thetaStart = Math.PI * 0.25; // ui: thetaStart
    const thetaLength = Math.PI * 0.5; // ui: thetaLength
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.TetrahedronGeometry(radius);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7; // ui: radius
    const detail = 2; // ui: detail
    const geometry = new THREE.TetrahedronGeometry(radius, detail);
    primitivesBox.push(geometry);
  }

  {
    const radius = 5; // ui: radius
    const tubeRadius = 2; // ui: tubeRadius
    const radialSegments = 8; // ui: radialSegments
    const tubularSegments = 24; // ui: tubularSegments
    const geometry = new THREE.TorusGeometry(
      radius,
      tubeRadius,
      radialSegments,
      tubularSegments
    );
    primitivesBox.push(geometry);
  }
  {
    const radius = 3.5; // ui: radius
    const tubeRadius = 1.5; // ui: tubeRadius
    const radialSegments = 8; // ui: radialSegments
    const tubularSegments = 64; // ui: tubularSegments
    const p = 2; // ui: p
    const q = 3; // ui: q
    const geometry = new THREE.TorusKnotGeometry(
      radius,
      tubeRadius,
      tubularSegments,
      radialSegments,
      p,
      q
    );
    primitivesBox.push(geometry);
  }
  {
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const tubularSegments = 20; // ui: tubularSegments
    const radius = 1; // ui: radius
    const radialSegments = 8; // ui: radialSegments
    const closed = false; // ui: closed
    const geometry = new THREE.TubeGeometry(
      path,
      tubularSegments,
      radius,
      radialSegments,
      closed
    );
    primitivesBox.push(geometry);
  }
  {
    const size = 8;
    const widthSegments = 2;
    const heightSegments = 2;
    const depthSegments = 2;
    const boxGeometry = new THREE.BoxGeometry(
      size,
      size,
      size,
      widthSegments,
      heightSegments,
      depthSegments
    );
    const geometry = new THREE.EdgesGeometry(boxGeometry);
    primitivesBox.push(geometry);
  }
  {
    const radius = 7;
    const widthSegments = 6;
    const heightSegments = 3;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const thresholdAngle = 1; // ui: thresholdAngle
    const geometry = new THREE.EdgesGeometry(sphereGeometry, thresholdAngle);
    primitivesBox.push(geometry);
  }
  {
    const size = 8;
    const widthSegments = 2; // ui: widthSegments
    const heightSegments = 2; // ui: heightSegments
    const depthSegments = 2; // ui: depthSegments
    const geometry = new THREE.WireframeGeometry(
      new THREE.BoxGeometry(
        size,
        size,
        size,
        widthSegments,
        heightSegments,
        depthSegments
      )
    );
    primitivesBox.push(geometry);
  }

  const loader = new THREELOADER.FontLoader();
  // promisify font loading
  function loadFont(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  }

  async function doit() {
    const font = await loadFont(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
    );
    const geometry = new THREETEXT.TextGeometry("three.js", {
      font: font,
      size: 3.0,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.3,
      bevelSegments: 5,
    });
    return geometry;
  }
  const geo = await doit();
  const mesh = new THREE.Mesh(geo, createMaterial());
  geo.computeBoundingBox();
  geo.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

  const parent = new THREE.Object3D();
  parent.add(mesh);

  addObject(-3, 0, parent, objects);

  // red points circle
  {
    const radius = 7;
    const widthSegments = 40;
    const heightSegments = 20;
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.PointsMaterial({
      color: "blue",
      size: 1, // 글로벌 단위
      // sizeAttenuation: false,
    });
    const points = new THREE.Points(geometry, material);
    addObject(-3, -1, points, objects);
  }

  primitivesBox.push(geo);
  primitivesBox.forEach((geometry, idx) =>
    addSolidGeometry((idx % 5) - 2, 3 - Math.floor(idx / 5), geometry, objects)
  );

  return objects;
}

function addSolidGeometry(x, y, geometry, objects) {
  const mesh = new THREE.Mesh(geometry, createMaterial());
  addObject(x, y, mesh, objects);
}

function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}

function addObject(x, y, obj, objects) {
  const spread = 15;
  obj.position.x = x * spread;
  obj.position.y = y * spread;
  objects.push(obj);
}
