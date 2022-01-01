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

## [반응형 디자인](https://threejs.org/manual/#ko/responsive)

Three.js 앱을 어떤 환경에서든 구동할 수 있도록 반응형으로 만드는 법에 대해 알아볼 것입니다.
Three.js의 경우 일반 웹보다 고려해야 할 요소가 많습니다.
예를 들어 상하좌우에 컨트롤 패널이 있는 3D 에디터라든가, 문서 사이에 들어가는 동적 그래프를 상상해볼 수 있죠.

canvas 요소는 기본적으로 300x150 픽셀, display 속성은 inline입니다.

창 크기에 따라 늘어나는 문제부터 해결해봅시다. 먼저 카메라의 aspect(비율) 속성을 canvas의 화면 크기에 맞춰야 합니다. 이는 canvas의 clientWidth와 clientHeight 속성을 이용해 간단히 해결할 수 있죠.

이제 계단현상을 없애 봅시다.

- canvas 요소에는 두 종류의 크기값이 있습니다.
  하나는 아까 CSS로 설정한 canvas 요소의 크기이고, 다른 하나는 canvas 원본 픽셀 수에 대한 값입니다.
- 예를 들어 128x64 픽셀인 이미지가 있다고 합시다.
- 우리는 CSS를 이용해 이 이미지 요소를 400x200 픽셀로 보이도록 할 수 있죠.
- canvas도 마찬가지입니다. 편의상 CSS로 지정한 크기를 디스플레이 크기라고 부르겠습니다.

- canvas의 원본 크기, 해상도는 드로잉버퍼(drawingbuffer)라고 불립니다.
- Three.js에서는 renderer.setSize 메서드를 호출해 canvas의 드로잉버퍼 크기를 지정할 수 있죠.
- 어떤 크기를 골라야 하냐구요? 당연히 "canvas의 디스플레이 크기"죠!
- 다시 canvas의 clientWidth와 clientHeight를 이용합시다.

canvas의 원본 크기와 디스플레이 크기를 비교해 원본 크기를 변경할지 결정하는 함수를 하나 만들어줍니다.

canvas를 리사이징할 필요가 있는지 검사했다는 점에 주의하세요. canvas 스펙상 리사이징은 화면을 다시 렌더링해야만 하므로, 같은 사이즈일 때는 리사이징을 하지 않으므로써 불필요한 자원 낭비를 막는 것이 좋습니다.

### HD-DPI 디스플레이 다루기

HD-DPI는 고해상도(high-density dot per inch)의 줄임말입니다.
(스마트폰의 실제 화면 크기가 데스크탑에 비해 훨씬 작지만, 해상도는 비슷한 경우를 생각하면 됩니다. 한 픽셀을 선명하게 표현하기 위해 다수의 작은 픽셀을 넣는 것. 역주).

브라우저에서는 이에 대응하기 위해 픽셀의 집적도에 상관 없이 CSS 픽셀을 이용해 요소의 크기를 지정합니다. 스마트폰이든, 데스크탑이든 브라우저는 요소를 같은 크기로 좀 더 촘촘하게 할 뿐이죠.

Three.js로 HD-DPI를 다루는 방법은 아주 다양합니다.

- 첫째는 아무것도 하지 않는 것입니다.

  - 3D 렌더링은 많은 GPU 자원을 소모하기 때문에 아마 가장 흔한 경우일 겁니다. 2018년의 이야기이긴 하지만, 모바일 기기는 데스크탑에 비해 GPU 성능이 부족함에도 더 높은 해상도를 가진 경우가 대부분입니다. 현재 플래그쉽 스마트폰은 HD-DPI 약 3배의 해상도를 지녔습니다. 쉽게 말해 HD-DPI가 아닌 기기와 비교했을 때 한 픽셀 당 픽셀 수가 1:9라는 것이고 이는 9배나 더 많은 렌더링 작업을 처리해야 한다는 것을 의미하죠.

  - 9배 많은 픽셀을 처리하는 건 굉장히 까다로운 작업이지만, 만약 코드를 저대로 내버려 둔다면 우리의 코드가 1픽셀을 계산할 때마다 브라우저는 해당 픽셀보다 3배 큰 픽셀을 렌더링해야 합니다(3배 곱하기 3배 = 9배 많은 픽셀).

  - 이는 낮은 FPS, 즉 화면이 버벅거리게 만들 것이므로 특히 무거운 Three.js 앱을 만들 때는 지양해야 하는 요소이죠.

- 하나는 rederer.setPixelRatio 메서드를 이용해 해상도 배율을 알려주는 것입니다.

  - 브라우저로부터 CSS 픽셀과 실제 기기 픽셀의 배율을 받아 Three.js에게 넘겨주는 것이죠.
  - `renderer.setPixelRatio(window.devicePixelRatio);`
  - 그러면 renderer.setSize는 이제 알아서 사이즈에 배율을 곱해 리사이징할 것입니다....만 이 방법은 추천하지 않습니다.

- 다른 방법은 canvas를 리사이징할 때 직접 계산하는 것입니다.

  - ```
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = canvas.clientWidth _ pixelRatio | 0;
      const height = canvas.clientHeight _ pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
      renderer.setSize(width, height, false);
      }
      return needResize;
    }
    하나는 rederer.setPixelRatio
    ```

  - 객관적으로 따져봐도 이 방법이 훨씬 낫습니다. 이 방법으로는 개발자가 원하는 결과가 나오니까요.

## [원시 모델](https://threejs.org/manual/#ko/primitives)

먼저 Three.js의 원시 모델이란, 주로 런타임에서 다양한 인자들로 정의한 3D 모양을 의미합니다.

- 원시 모델은 주로 구체로 공 모양을 만든다거나, 수많은 육면체를 모아 3D 그래프를 만드는 데 사용합니다.
- 또한 3D에 입문한다거나, 모의 프로젝트를 만들 때 사용하기도 하죠.
- 물론 대부분의 3D 앱은 그래픽 전문가가 블렌더(Blender), 마야(Maya), 시네마 4D(Cinema 4D) 등으로 만든 그래픽 모델을 사용합니다

### Types

- BoxGeometry -> 육면체(Box)
- CircleGeometry -> 원(flat circle)
- ConeGeometry -> 원뿔(Cone)
- CylinderGeometry -> 원통(Cylinder)
- DodecahedronGeometry -> 십이면체(Dodecahedron)
- ExtrudeGeometry -> 사각(bevel)을 주어 깍아낸(extruded) 2D 모양입니다.
  - ExtrudedGeometry는 나중에 설명할 TextGeometry과 TextGeometry의 기초 모델입니다.
- IcosahedronGeometry -> 이십면체(Icosahedron)
- OctahedronGeometry -> 팔면체(Octahedron)
- ParametricGeometry -> 2D 격자값(격자 하나의 벡터값)을 받아 3D 값을 반환하는 함수를 인자로 전달하여 면을 만듭니다.
- PlaneGeometry -> 2D 평면(2D plane)
- PolyhedronGeometry -> 다면체
- RingGeometry -> 중앙이 빈 2D 디스크(disc)
- ShapeGeometry -> 삼각형으로 이루어진 2D 윤곽선
- SphereGeometry -> 구(Sphere)
- TetrahedronGeometry -> 사면체
- TextGeometry -> 3D 폰트와 문자열로 만든 3D 텍스트입니다.
  - Three.js의 텍스트는 기본적으로 중앙을 중심으로 돌지 않는다는 것입니다.
  - 기본 회전축은 왼쪽 모서리로, 중앙을 중심으로 돌게 하려면 Three.js에게 geometry의 bounding box(경계 좌표)를 계산해 달라고 요청한 뒤, bounding box의 getCenter 메서드에 해당 mesh의 위치값 객체를 넘겨주어야 합니다.
- TorusGeometry -> 원환체(torus), 도넛(donut)
- TorusKnotGeometry -> 원환체 매듭(torus knot)
- TubeGeometry -> 패스를 따라 이어진 원
- EdgesGeometry -> 다른 geometry를 받는 헬퍼 객체로, 각 면 사이의 각이 일정 값 이상일 때만 모서리를 표시합니다.

얼마나 많이 세분할지는 필요에 따라 다르게 설정하면 됩니다.

5000 삼각형인 오른쪽 구체가 480 삼각형인 중간 구체보다 훨씬 좋다고 이야기하기 모호합니다.
만약 지구본을 만들기 위한 구체 하나를 만든다고 하면, 10000개의 삼각형으로 구체를 만드는 것이 나쁜 선택은 아닙니다. 하지만 1000개의 삼각형으로 만든 구체 1000개를 렌더링할 경우, 이는 총 천만개의 삼각형이 됩니다.
이를 부드럽게 움직이려면 브라우저가 1초에 60프레임을 렌더링해야 하니, 결과적으로 이는 1초에 6억개의 삼각형을 렌더링하라고 하는 것과 같죠.
절대 간단한 연산이 아닙니다.

## 참고 사항

```
import * as THREELOADER from "three/examples/jsm/loaders/FontLoader.js";
import * as THREETEXT from "three/examples/jsm/geometries/TextGeometry.js";
"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json" // 폰트 링크
```

## [씬 그래프](https://threejs.org/manual/#ko/scenegraph)

Three.js에서 가장 중요한 것은 무엇보다 씬 그래프(scene graph)입니다.
3D 엔진에서 씬 그래프란 요소(node)의 계층 구조를 그림으로 나타낸 것으로, 여기서 각 요소는 각각의 "지역 공간(local space)"을 가리킵니다.

### 예시

태양계, 그 중에서도 태양, 지구, 달

- 지구는 태양을 중심으로 공전합니다
- 달은 지구를 중심으로 공전하죠
- 달의 공전 궤도는 원과 유사합니다
- 달의 관점에서 달은 지구의 "지역 공간" 안에서 공전하는 셈이죠
- 태양이 봤을 때 달은 취한 사람처럼 스피로그래프(spirograph, 용수철 모양의 그래프)를 그리며 돌지만, 달은 그저 지구의 "지역 공간"을 도는 것에만 집중할 뿐입니다.

우리는 지구에서 살지만 지구의 자전이나 자전축, 태양을 공전하는 일은 크게 신경쓰지 않습니다. 이건 지구의 일이니까요. 우리가 걷거나, 뭔가를 타고 이동하거나 수영하거나 달리거나 하는 일들은 지구의 일과는 무관해 보입니다. 그래서 옛날 사람들은 지구가 공전, 자전한다는 사실을 쉽게 받아들이지 못했죠. 우리가 걷든, 헤엄을 치든, 우리의 삶은 지구의 "지역 공간" 안에서 이루어집니다. 태양에서 봤을 때 여러분은 지구를 시속 약 1,600km로 돌고 태양의 주위를 시속 약 107,800km로 도는 셈이지만, 우리는 이렇게 빨리 움직이기 위해 따로 노력할 필요가 없습니다. 달과 마찬가지로 우리가 신경써야 하는 건 지구의 "지역 공간" 뿐이죠.

Object3D는 Mesh와 마찬가지로 씬 그래프의 한 요소지만, material이나 geometry가 없다는 점이 다릅니다.
그저 하나의 빈 "지역 공간"인 셈이죠.

sunMesh와 earthMesh는 solarSystem의 자식입니다.
이 3 객체는 각각 회전하죠.
이제 earthMesh는 sunMesh의 자식이 아니므로 5배 커지지도 않았습니다.
