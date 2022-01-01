import * as THREE from "three";

export const SCENE_GRAPH_OBJ = [];
export const ANI_OBJ = [];
// 하나의 geometry로 모든 태양, 지구, 달을 생성

{
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
  SCENE_GRAPH_OBJ.push(solarSystem);
  ANI_OBJ.push(solarSystem, sunMesh, earthMesh, earthOrbit, moonMesh);
}
