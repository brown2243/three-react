# 다시 하는 ThreeJS 학습

## [ThreeJS란?](https://threejs.org/manual/#ko/fundamentals)

WebGL은 점, 선, 삼각형만을 그리는 아주 단순한 시스템입니다.
Three.js는 이런 3D 요소들의 처리를 도와 직관적인 코드를 짤 수 있도록 해줍니다.

**Three.js 앱의 구조**

- Renderer
  - Three의 핵심 객체
  - Scene, Camera 객체를 넘겨받아, 카메라의 절두체 안 3D 씬의 일부를 평면이미지로 렌더링
- Camera
  - Camera는 굳이 씬 그래프에 포함될 필요가 없음.
  - 다른 객체와 마찬가지로 Camera 또한 다른 객체의 자식 객체가 될 수 있습니다. 이러면 부모 객체에 따라 Camera 또한 움직이겠죠
- Scene Graph
  - 다수의 Object(mesh, Light...)로 이루어진 트리 구조의 객체
  - Scene은 씬 그래프의 최상위 노드로서 배경색(background color), 안개(fog) 등의 요소를 포함합니다.
  - Mesh
    - 어떤 Material(재료,재질)로 하나의 Geometry(도형,형태)를 그리는 객체
    - Material
      - 기하학 객체를 그리는 표면속성
      - 색이나 밝기를 지정할 수 있고, 여러 Texture 사용가능
    - Geometry
      - 구, 정육면체, 면, 개, 고양이,사람... 다양한 것이 될 수 있다.
      - ThreeJS에서 여러 내장객체를 제공

`const renderer = new THREE.WebGLRenderer({canvas});`

이 렌더러(renderer)는 여러분이 입력한 데이터를 실제로 canvas에 그려주는 역할을 맡습니다.
만약 Three.js에 canvas 요소를 넘겨주지 않으면, Three.js는 canvas 요소를 자동으로 생성합니다.

```
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

fov는 field of view(시야각)의 줄임말입니다.
예제의 경우 수직면 75도로 설정했습니다.
**Three.js의 대부분이 각도 단위로 호도(radians)를 사용하는데, 원근 카메라만 특이하게 도(degrees)를 인자로 받습니다**

aspect는 canvas의 가로 세로 비율입니다. 이는 다른 글 에서 자세히 다루겠지만, 기본 설정으로 canvas의 크기는 300x150이니 비율도 300/150, 2로 설정했습니다.

near와 far는 카메라 앞에 렌더링되는 공간 범위를 지정하는 요소입니다. 이 공간 바깥에 있는 요소는 화면에서 잘려나가며, 렌더링되지 않을 것입니다.

위에서 살펴본 4가지 속성은 하나의 "절두체"를 만듭니다. "절두체"는 끝부분이 잘려나간 피라미드처럼 생긴 3차원 모양인데, 구, 정육면체, 각기둥(prism)처럼 3차원 모양의 하나로 생각하면 됩니다.

그리고 앞서 말했듯 절두체 안에 있는 요소만 렌더링되며, 바깥에 있는 요소는 렌더링되지 않습니다.
