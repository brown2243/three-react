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

### 씬 그래프의 요소를 시각화하는 것이 도움이 될 때도 있습니다.

이 것을 도와줄 헬퍼 클래스가 있습니다.
AxesHelper로, 이 클래스는 지역 X, Y, Z 축을 표시해줍니다. 한 번 여태까지 만든 요소에 모두 추가해보죠.

x축(빨강) 그리고 z축(파랑) 축이 보이나요? 카메라가 바로 위에서 아래를 내려다 보고, 각 물체도 y축을 따라 회전하므로 y축(초록)은 보여도 거의 점처럼 보일 겁니다.

또 Three.js와 함께 사용하기로 유명한 lil-gui도 사용할 겁니다. lil-gui는 UI 라이브러리로, 객체와 속성 이름을 넘겨받고, 해당 속성의 타입을 기반으로 속성값을 UI로 조정할 수 있게 해줍니다.

### 씬 그래프 예시

자동차

- Root(scene)
  - Car body
    - Left front wheel
    - right front wheel
    - Left back wheel
    - right back wheel

다른 예시는 링크에서;;

## [Materials](https://threejs.org/manual/#ko/materials)

hree.js에는 기본으로 제공하는 재질(materials) 몇 개가 있습니다.
재질이란, 물체가 씬(scene)에 어떤 식으로 나타날지를 결정하는 요소로서,
어떤 재질을 사용할지는 전적으로 상황에 따라 판단해야 합니다.

재질의 속성(property)를 정하는 방법은 크게 두 가지로 나뉩니다.
하나는 이전처럼 생성자를 호출할 때 값을 넘겨주는 것이고,
다른 하나는 생성한 뒤에 바꾸는 것이죠.
rgb, hex 등 다양한 방법으로 색을 지정할 수 있습니다.

```
material.color.set(0x00FFFF);    // CSS의 #RRGGBB 형식
material.color.set(cssString);   /* CSS 색상 문자열, 예를 들어 'purple', '#F32',
                                  * 'rgb(255, 127, 64)',
                                  * 'hsl(180, 50%, 25%)' 등
                                  */
material.color.set(someColor)    // THREE.Color에 정의된 static 색상
material.color.setHSL(h, s, l)   // hsl 색상, 0부터 1까지
material.color.setRGB(r, g, b)   // rgb 색상, 0부터 1까지

생성시에도 hex 값 또는 CSS 문자열을 전달해도 됩니다.
const m1 = new THREE.MeshBasicMaterial({color: 0xFF0000});         // 빨강
const m2 = new THREE.MeshBasicMaterial({color: 'red'});            // 빨강
const m3 = new THREE.MeshBasicMaterial({color: '#F00'});           // 빨강
const m4 = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'});   // 빨강
const m5 = new THREE.MeshBasicMaterial({color: 'hsl(0,100%,50%)'); // 빨강
```

- MeshBasicMaterial -> 광원의 영향을 받지 않습니다.
- MeshLambertMaterial -> 정점에서만 광원을 계산
- MeshPhongMaterial ->
  - 픽셀 하나하나 전부 광원을 계산,
  - 반사점(specular highlights, 물체가 조명을 받을 때 물체에 나타나는 밝은 점)도 지원
  - shininess 속성으로 반사점의 밝기를 조절할 수 있습니다(기본값 30).

왜 MeshPhongMaterial로 MeshBasicMaterial과 MeshLambertMaterial을 구현할 수 있는데 3가지로 분리해 놓았을까요? 이미 감을 잡으셨겠지만, 재질이 정교할수록 GPU의 부담이 커지기 때문입니다.

- MeshToonMaterial -> 투톤을 띄어 카툰 느낌을 줍니다.
- 물리 기반 렌더링((Physically Based Rendering) => PBR)을 위한 재질
  - 이 두 가지 PBR 재질은 실제 세계에서처럼 물체를 구현하기 위해 훨씬 복잡한 수학을 사용하죠.
  - MeshStandardMaterial
    - MeshPhongMaterial과 MeshStandardMaterial의 가장 큰 차이점은 사용하는 속성이 다르다는 점입니다.
    - MeshPhongMaterial은 shininess를 사용하지만, MeshStandardMaterial은 roughness와 metalness 두 가지 속성을 사용합니다.
    - roughness는 roughness는 0부터 1까지의 숫자값으로, shininess의 반대입니다. 높은 roughness를 가진 물체, 예를 들어 야구공은 빛 반사가 거의 없지만, 반대로 낮은 roughness를 가진 물체, 당구공은 매우 번들번들하죠.
    - metalness는 얼마나 금속성입니다. 얼마나 금속 재질에 가까울 것인가로써, 0은 아예 금속 같지 않은 것이고, 1은 완전히 금속처럼 보이는 것을 의미합니다.
  - MeshPhysicalMaterial
    - MeshStandardMaterial과 기본적으로 같지만,
    - 0부터 1까지의 clearcoat 속성으로 표면에 코팅 세기를 설정하고, clearcoatRoughness 속성으로 코팅의 거침 정도를 설정한다는 점이 다릅니다.

여태까지 살펴본 Three.js의 기본 재질을 성능이 빠른 것부터 나열하면,

**MeshBasicMaterial ➡ MeshLambertMaterial ➡ MeshPhongMaterial ➡ MeshStandardMaterial ➡ MeshPhysicalMaterial**
성능 부담이 클수록 더 현실적인 결과물을 얻을 수 있지만, 저사양 지원을 위해서는 코드 최적화에 그만큼 신경을 써야 합니다.

- ShadowMaterial -> 그림자로부터 데이터를 가져오는 데 사용하죠.
- MeshDepthMaterial은 각 픽셀의 깊이를 렌더링합니다.
- MeshNormalMaterial은 geometry의 법선(normals)을 보여줍니다. 법선이란 특정한 삼각형이나 픽셀이 가리키는 방향을 의미하죠.

### Material Properties

flatShading: 물체를 각지게(faceted) 표현할지의 여부입니다. 기본값은 false.
side: 어떤 면을 렌더링할지의 여부입니다. 기본값은 THREE.FrontSide(앞면). 다른 값으로는 THREE.BackSide(뒷면)와 THREE.DoubleSide(양면)를 지정할 수 있습니다. 3D로 렌더링한 물체는 대부분 불투명한 고체이기에, 뒷면(고체의 안쪽면)은 굳이 렌더링할 필요가 없습니다.
...
material.needsUpdate 만약 재질의 속성(properties)을 런타임에 바꿔야 할 경우, material.needsUpdate = true를 설정해 Three.js가 변경사항을 반영하도록 해야 하죠.

- flatShading 속성을 변경할 때
- 텍스처를 추가/제거할 때

## [Textures](https://threejs.org/manual/#ko/Textures)

Three.js에서 텍스처를 이야기하기란 쉽지 않습니다. 텍스처는 워낙 방대한 주제이고,
각 주제끼리도 서로 연결되어 있어 한 번에 설명하는 것이 거의 불가능에 가깝기 때문이죠.

### 하이, 텍스처

텍스처는 일반적으로 포토샵이나 김프 등의 프로그램으로 만든 이미지입니다.
TextureLoader를 새로 생성한 뒤, 인스턴스의 load 메서드에 이미지의 URL을 넘겨주어 호출하고, 반환 받은 값을 재질(material)의 map 속성에 지정합니다

```
const loader = new THREE.TextureLoader();

const material = new THREE.MeshBasicMaterial({
  map: loader.load('resources/images/wall.jpg'),
});
```

### 육면체 각 면에 다른 텍스처 지정하기

단순히 재질을 6개 만들어 Mesh를 생성할 때 배열로 넘겨주기만 하면 됩니다.

```
const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];
const cube = new THREE.Mesh(geometry, materials);
```

주의해야할 점은 모든 geometry가 재질을 배열로 받진 않는다는 점입니다. BoxGeometry나 BoxGeometry는 최대 6개, ConeGeometry와 ConeGeometry는 밑면과 뿔 부분에 하나씩 최대 2개, CylinderGeometry와 CylinderGeometry는 아래, 위, 옆면 하나씩 최대 3개를 지정할 수 있죠. 다른 경우에는 geometry를 따로 만들거나, 텍스처의 좌표를 직접 수정해야 합니다.

다른 3D 엔진에서나 Three.js에서나, 하나의 geometry에서 여러 텍스처를 쓰고 싶을 때는 보통 텍스처 아틀라스를 사용합니다. 텍스처 아틀라스란 여러 이미지로 구성된 하나의 텍스처로, geometry의 정점에 따라 텍스처의 좌표를 조절해 geometry의 각 삼각형이 텍스처의 일정 부분을 표현하도록 할 수 있습니다.

그렇다면 텍스처의 좌표란 무엇일까요? 이는 geometry의 각 정점에 추가되는 데이터로, 특정 정점에 텍스처의 어느 부분을 써야하는지를 나타냅니다. 자세한 사용법은 나중에 사용자 지정 geometry 만들기에서 살펴보겠습니다.

### 텍스쳐 불러오기

간단한 방법
이 사이트의 예제는 대부분 텍스처를 로딩할 때 간단한 메서드를 사용했습니다. TextureLoader를 생성하고, 인스턴스의 load 메서드를 호출하는 거죠. 이 load 메서드는 Texture 객체를 반환합니다.

이 메서드는 비동기로 작동한다는 점입니다. 이미지를 완전히 불러온 후 이미지로 텍스처를 업데이트하기 전까지, 텍스처는 투명하게 보일 겁니다.

```
두 번째 인자로 콜백(callback) 함수
const loader = new THREE.TextureLoader();
loader.load('resources/images/wall.jpg', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);  // 회전 애니메이션을 위해 배열에 추가
});
```

### 다수의 텍스처를 불러온 후 처리하기

다수의 텍스처를 한 번에 불러와야 할 경우 LoadingManager를 사용할 수 있습니다. TextureLoader를 생성할 때 미리 생성한 LoadingManager의 인스턴스를 인자로 넘겨주고, LoadingManager 인스턴스의 onLoad 속성에 콜백 함수를 설정해주는 거죠.

```
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);

loadManager.onLoad = () => {
  loadingElem.style.display = 'none';
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  cubes.push(cube);  // 회전 애니메이션을 위해 배열에 추가
};

loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => { // 마지막으로 불러온 자원의 URL, 현재까지 불러온 자원의 수, 총 지원의 수
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
};

};
```

### 다른 도메인(origin)에서 텍스처 불러오기

다른 서버에서 이미지를 불러오려면 해당 서버가 CORS 헤더를 보내줘야 합니다. CORS 헤더가 없다면 Three.js가 이미지를 불러오지 않을 것이고, 에러가 발생할 겁니다. 만약 이미지 호스팅 서버를 운영한다면 해당 서버가 CORS 헤더를 보내는지 확인해보세요.

imgur, flickr, github 등의 사이트는 자신이 호스팅하는 이미지를 사용해도 좋다는 헤더를 보냅니다. 대부분의 웹사이트는 이를 허용하지 않죠.

### 메모리 관리

텍스처는 Three.js 앱에서 메모리를 가장 많이 사용하는 요소 중 하나입니다. 대체로 텍스처는 약 너비 _ 높이 _ 4 \* 1.33 바이트의 메모리를 사용합니다.

여기서 압축은 그다지 중요한 요소가 아닙니다. 예를 들어 집이 포함된 장면(scene)을 만든다고 해보죠. 집 안에는 탁자가 있고, 탁자의 윗면에 나무 텍스처를 씌우려고 합니다.

이 이미지는 매우 고 배율로 압축되어 157kb 밖에 되지 않습니다. 상대적으로 다운 속도는 빠를 것이나, 이 이미지의 실제 크기는 3024 x 3761 픽셀입니다. 위 공식에 따라 이 이미지를 적용해보면,
`3024 * 3761 * 4 * 1.33 = 60505764.5` 입니다.

무려 약 60 메가바이트의 메모리를 사용합니다. 이런 텍스처가 몇 개만 더 있어도 메모리 부족으로 앱을 사용하지 못할 수 있죠(OUT_OF_MEMORY).

극단적인 예제이기는 하나, 이 예제는 텍스처를 사용하는데 숨겨진 비용을 고려해야 한다는 것을 잘 알려줍니다. Three.js가 텍스처를 사용하려면 GPU에 텍스처를 넘겨주어야 하는데, GPU는 일반적으로 압축하지 않은 데이터를 사용하죠.

**이 예시의 교훈은 파일의 용량이 아니라 파일의 해상도를 줄어야 한다는 것입니다.**

### JPG vs PNG

이는 HTML과 마찬가지입니다. JPG는 손실 압축을 사용하고, PNG는 비손실 압축을 사용하는 대신 보통 PNG가 더 용량이 크죠. 하지만 PNG는 투명도를 지원합니다. PNG는 비-이미지 데이터인 법선 맵(normal maps), 그리고 나중에 살펴볼 다른 비-이미지 데이터를 사용하기에 현재로써는 가장 적당한 파일 형식입니다.

위에서 말했듯, WebGL에서는 JPG가 용량이 더 작긴 해도 PNG 형식보다 메모리 점유율이 낮진 않습니다.

### 필터링과 Mips

GPU는 작은 정육면체를 표현할 때 어떻게 각 픽셀의 색상을 결정할까요? 정육면체가 작아도 너무 작아서 1, 2 픽셀 정도라면요?

이게 바로 필터링(filtering)이 있는 이유입니다.

포토샵이라면 근처 픽셀의 평균을 내 해당 1, 2 픽셀의 형태를 결정할 겁니다. 이는 매우 무거운 작업이죠. GPU는 이 문제를 해결하기 위해 밉맵(mipmaps)을 사용합니다.

밉(mips)은 텍스처의 복사본으로, 각 밉은 축소된 이전 밉보다 반만큼 작습니다. 밉은 1x1 픽셀 밉을 생성할 때까지 계속 생성되죠. 위 이미지의 경우 밉은 다음처럼 생성될 겁니다.

Three.js에서는 텍스처의 크기가 원본보다 클 때와 작을 때 각각 어떻게 표현할지를 설정할 수 있습니다.

- 텍스처의 크기가 원본보다 클 때의 필터는 texture.magFilter 속성을 THREE.NearestFilter나 THREE.LinearFilter로 지정해 설정합니다.

  - NearestFilter는 말 그대로 텍스처에서 가장 가까운 픽셀을 고르는 것입니다. 낮은 해상도라면 텍스처가 픽셀화되어 마인크래프트 같은 느낌을 주겠죠.
  - LinearFilter는 가장 가까운 4개의 픽셀을 골라 각 픽셀의 실제 거리에 따라 적절한 비율로 섞는 것을 말합니다.

- 텍스처가 원본 크기보다 작을 때의 필터는 texture.minFilter 속성을 다음 6가지 값 중 하나로 지정해 사용합니다.
  - THREE.NearestFilter-> 원본보다 클 때와 마찬가지로 가장 가까운 픽셀을 선택합니다
  - THREE.LinearFilter -> 원본보다 클 때와 마찬가지로 주변의 가까운 픽셀 4개를 골라 섞습니다
  - THREE.NearestMipmapNearestFilter -> 적절한 밉을 고른 뒤 밉에서 픽셀 하나를 선택합니다
  - THREE.NearestMipmapLinearFilter -> 두 개의 밉을 골라 픽셀을 하나씩 선택한 후, 두 픽셀을 섞습니다
  - THREE.LinearMipmapNearestFilter -> 적절한 밉을 고른 뒤 픽셀 4개를 골라 섞습니다
  - THREE.LinearMipmapLinearFilter -> 두 개의 밉을 골라 각각 픽셀을 4개씩 선택하고, 선택한 8개의 픽셀을 하나의 픽셀로 혼합합니다

Three.js를 사용하다보면 하나의 물체에 4, 5개의 텍스처가 들어가는 경우도 빈번합니다. 4개의 텍스처에서 각각 8개의 픽셀을 처리해야 하니, 이는 한 프레임당 32개의 픽셀을 처리해야 함을 의미하죠. 이는 저사양 기기를 고려할 때 특히 중요히 여겨야 하는 요소입니다.

### 텍스처의 반복(repeating), 위치 조절(offseting), 회전(rotating), 래핑(wrapping)

텍스처에는 반복, 위치, 회전 설정이 있습니다.

Three.js는 기본적으로 텍스처를 반복하지 않습니다. 반복 여부를 설정하는 2가지 속성이 있는데, 하나는 수평 래핑을 설정하는 wrapS이고, 또 하나는 수직 래핑을 설정하는 wrapT입니다.

```
// THREE.ClampToEdgeWrapping //텍스처의 가장자리 픽셀을 계속해서 반복합니다
// THREE.RepeatWrapping //텍스처 자체를 반복합니다
// THREE.MirroredRepeatWrapping //텍스처 자체를 반복하되, 매번 뒤집습니다.

someTexture.wrapS = THREE.RepeatWrapping;
someTexture.wrapT = THREE.RepeatWrapping;

반복은 repeat 속성으로 설정할 수 있죠.

const timesToRepeatHorizontally = 4;
const timesToRepeatVertically = 2;
someTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

텍스처의 위치는 offset 속성을 설정해 조절할 수 있습니다. 텍스처 위치의 단위는 텍스처의 크기와 1:1, 즉 0은 위치가 그대로인 것이고 1은 각 축에서 텍스처 크기만큼 이동한 것을 의미하죠.

const xOffset = .5;   // 텍스처 너비의 반만큼 이동
const yOffset = .25;  // 텍스처 높이의 1/4만큼 이동
someTexture.offset.set(xOffset, yOffset);

텍스처의 회전은 rotation 속성을 라디안(radians) 단위로 지정해 조절할 수 있습니다. center 속성은 회전의 중심을 정하는 데 사용하죠. center 속성의 기본값은 0, 0으로 왼쪽 상단을 기준으로 회전하고, offset과 마찬가지로 텍스처의 크기를 기준으로 단위가 정해지기에 .5, .5로 설정하면 텍스처의 중앙을 기준으로 회전합니다.

someTexture.center.set(.5, .5);
someTexture.rotation = THREE.MathUtils.degToRad(45);
```

## [Lights](https://threejs.org/manual/#ko/Lights)

### AmbientLight(자연광)

물체들이 평평하고, 윤곽이 뚜렷하지 않습니다. AmbientLight는 물체와 조명의 색, 그리고 조명의 밝기를 곱한 것과 같죠.
`color = materialColor * light.color * light.intensity;`
AmbientLight에는 방향이라는 개념이 없죠.
주변광은 완전히 고르게 적용되고 공간 안 물체의 색을 바꾸는 역할만 하기 때문에 실용적이지 않은데다 그다지 조명처럼 느껴지지도 않습니다.
어두운 장면을 덜 어둡게 만드는 정도에만 도움이 되죠.

### HemisphereLight(반구광)

HemisphereLight는 천장과 바닥의 색을 인자로 받아, 물체의 천장을 바라보는 면은 천장 색, 바닥을 바라보는 면은 바닥 색으로 혼합합니다.
이 또한 그다지 입체적이지 않습니다. 아까보다는 낮지만 전체적으로 2D처럼 보이네요.
HemisphereLight는 주로 풍경을 표현하거나 할 때 다른 조명과 함께 사용합니다.
다른 조명과 조합할 때 유용하고, 간단히는 AmbientLight 대신 사용할 수 있죠.

### DirectionalLight(직사광)

DirectionalLight는 주로 태양을 표현할 때 사용합니다.
먼저 light와 light.target(목표)을 모두 장면에 추가해야 합니다.
그래야 Three.js의 DirectionalLight가 목표가 있는 방향으로 빛을 쬘 테니까요.

### PointLight(레이저?)

PointLight는 한 점에서 무한히 뻗어나가는 광원입니다.

PointLightHelper는 점의 표상을 그립니다. 점의 표상이란 점으로는 확인이 어려우니, 기본값으로 다이아몬드 형태의 와이어프레임(wireframe)을 대신 그려놓은 것이죠. 점의 형태는 조명에 mesh 객체를 하나 넘겨 얼마든지 바꿀 수 있습니다.

PointLight에는 추가로 distance 속성이 있습니다. distance가이 0이면 PointLight의 밝기가 무한대임을 의미하고, 0보다 크면 distance에 지정된 거리만큼만 영향을 미칩니다.

### SpotLight

스포트라이트는 비유하자면 원뿔 안의 PointLight입니다. **차이점은 원뿔 안에서만 빛난다는 점이죠.**

SpotLight의 원뿔은 종류는 외부 원뿔과 내부 원뿔 두 가지입니다. 빛의 밝기는 내부 원뿔에서 가장 세고, 외부 원뿔에 가까워질수록 0까지 낮아집니다.

DirectionalLight와 마찬가지로 SpotLight도 목표의 위치를 정해줘야 합니다. 원뿔의 밑면이 해당 목표물을 바라보게 되죠.

원뿔의 내각은 angle에 호도(radians)값을 지정해 설정합니다. 텍스처 예제에서 사용했던 DegRadHelper 객체를 사용해 UI에는 도(degrees)로 표시하도록 하겠습니다.

### RectAreaLight

이름 그대로 사각 형태의 조명으로, 형광등이나 천장의 유리를 통과하는 태양빛을 표현하기에 적합합니다.

`RectAreaLight`는 `MeshStandardMaterial`과 `MeshPhysicalMaterial`만 지원합니다.
예전 코드에서 재질(material)을 `MeshStandardMaterial`로 바꾸겠습니다.

RectAreaLight를 사용하려면 별도의 데이터를 불러와야 합니다.
또한 RectAreaLightHelper도 같이 불러와 조명을 시각화하겠습니다.

```
import { RectAreaLightUniformsLib } from '/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from '/examples/jsm/helpers/RectAreaLightHelper.js';
```

**RectAreaLight는 DirectionalLight, SpotLight와 달리 목표를 사용하지 않습니다.**
빛의 방향은 rotation으로 설정할 수 있죠.
**또 RectAreaLightHelper는 직접 조명을 자식으로 두는 다른 헬퍼 객체와 달리, 해당 조명의 자식이어야 합니다.**

조명의 rotation, width, height 속성을 조정할 수 있도록 GUI도 수정해줍니다.

```
위 예제에는 WebGLRenderer의 physicallyCorrectLights(물리 기반 조명) 설정이 있습니다. 이는 거리에 따라 빛이 어떻게 떨어질지 결정하는 속성으로, PointLight와 SpotLight가 이 설정의 영향을 받습니다. RectAreaLight는 마찬가지로 설정의 영향도 받고, 기본적으로 이 설정을 사용하죠.
```

이 설정을 사용하면 기본적으로 조명의 distance나 intensity 대신 power 속성을 루멘(lumens) 단위로 설정해야 합니다. 그러면 Three.js는 물리적 계산을 통해 실제 광원을 흉내내죠. 예제의 거리 단위는 미터(meters)이니, 60w짜리 전구는 약 800루멘 정도일 겁니다. 그리고 조명의 부서짐(decay) 정도를 설정하는 decay 속성도 있습니다. 현실적인 조명을 위해서는 2 정도가 적당하죠.

**조명은 renderer가 장면을 렌더링하는 속도에 영향을 미칩니다. 그러니 가능한 적은 조명을 쓰는 게 좋죠.**

## [cameras](https://threejs.org/manual/#ko/cameras)

### Three.js에서 가장 자주 사용하는 카메라는 여태까지 썼던 PerspectiveCamera(원근 카메라)입니다.

이 카메라는 멀리 있는 물체를 가까이 있는 것보다 상대적으로 작게 보이도록 해주죠.
PerspectiveCamera는 절두체(frustum)를 만듭니다.
PerspectiveCamera는 4가지 속성을 바탕으로 절두체를 만듭니다.

- near는 절두체가 어디서 시작할지 결정하는 속성이고,
- far는 절두체의 끝입니다.
- fov는 시아갹(field of view)으로, near와 카메라의 거리에 따라 절두체의 높이를 계산해 적용합니다.
- aspect는 절두체의 너비에 관여하는 비율으로, 절두체의 너비는 절두체의 높이에 이 비율을 곱한 값입니다.

near를 0.0000000001로 설정하고 far를 10000000000000로 설정해버리면요?
이러면 모든 게 항상 다 보이지 않나요? 이유를 설명하자면, GPU는 어떤 물체가 앞에 있거나 다른 물체의 뒤에 있을 때만 정밀도가 높기 때문입니다. 정밀도는 일정량이 near와 far 사이에 퍼져 있는데, 기본적으로 카메라에 가까울 수록 정밀도가 높고 멀수록 정밀도가 낮아집니다.

**z-파이팅(z-fighting, Stitching) : 컴퓨터의 GPU가 어떤 픽셀이 앞이고 어떤 픽셀을 뒤로 보내야할지 결정할 정밀도가 모자를 때 발생하는 현상.**

```
const renderer = new THREE.WebGLRenderer({
      canvas,
      logarithmicDepthBuffer: true, // z-fighting 임시방편
    });
```

이 기능을 쓰지 말아야 하는 이유는

1. 이 기능이 일반적인 해결책보다 훨씬 성능이 나쁘기 때문입니다.
2. 거의 모든 데스크탑 GPU가 이 기능을 지원하나, 모바일 기기는 대부분 이 기능을 지원하지 않습니다.

게다가 이 기능을 활성화해도, near를 더 작게, far를 더 멀게 설정하다보면 결국 같은 현상을 만나게 될 겁니다.

이는 항상 near와 far를 설정하는데 많은 공을 들여야 한다는 의미입니다. near는 대상이 보이는 한 가장 멀게, far도 대상이 보이는 한 카메라와 가장 가깝게 설정하는 것이 좋죠. 만약 거대한 공간을 렌더링하는 경우, 예를 들어 사람의 속눈썹과 50km 떨어진 산을 동시에 보이게 하려면 다른 해결책-나중에 다룰지도 모르는-을 찾아야 합니다. 당장은 near와 far를 적절하게 설정하는 게 중요하다는 것만 알아둡시다.

### 두 번째로 자주 사용하는 카메라는 OrthographicCamera(정사영 카메라)입니다.

절두체 대신 left, right, top, bottom, near, far로 육면체를 정의해 사용하죠. 육면체로 화면을 투사하기에 원근 효과가 없습니다.

2분할 화면 예제를 수정해 첫 번째 화면을 OrthographicCamera로 바꾸겠습니다.

## [shadows](https://threejs.org/manual/#ko/shadows)

3D 그래픽에서 그림자란 그리 간단한 주제가 아닙니다.
그림자를 구현하는 방법은 아주 많지만 모두 단점이 있기에 어떤 것이 가장 효율적이라고 말하기 어렵습니다.

Three.js는 기본적으로 그림자 맵(shadow maps)을 사용합니다. **그림자 맵이란 그림자를 만드는 빛의 영향을 받는, 그림자를 드리우는 모든 물체를 빛의 시점에서 렌더링하는 기법을 말합니다. 중요하니 한 번 더 읽어보세요!**

다시 말해, 공간 안에 20개의 물체와 5개의 조명이 있고, 20개의 물체 모두 그림자를 드리우며 5개의 조명 모두 그림자를 지게 한다면, 한 장면을 만들기 위해 총 6번 화면을 렌더링할 것이라는 이야기입니다. 먼저 조명 1번에 대해 20개의 물체를 전부 렌더링하고, 다음에는 2번 조명, 그 다음에는 3번... 이렇게 처음 5번 렌더링한 결과물을 합쳐 최종 결과물을 만드는 것이죠.

만약 여기에 포인트(point) 조명을 하나 추가하면 조명 하나 때문에 6번을 다시 렌더링해야 합니다.

이 때문에 그림자를 지게 하는 조명을 여러개 만들기보다 다른 방법을 찾는 경우가 보통입니다. **주로 사용하는 방법은 조명이 여러개 있어도 하나의 조명만 그림자를 지게끔 설정하는 것이죠.**

물론 라이트맵(lightmaps)이나 앰비언트 오클루전(ambient occlusion)을 이용해 빛의 영향을 미리 계산할 수도 있습니다. 이러면 정적 조명이나 정적 빛 반사를 사용하는 것이기에 수정하기가 어렵지만, 적어도 성능은 빠릅니다. 이 두 가지 모두 나중에 별도로 다룰 것입니다.

**가짜 그림자를 사용하는 방법도 있습니다. 평면을 만들고, 흑백 텍스처를 입혀 땅 위에 그림자가 있을 만한 위치에 가져다 놓는 것이죠.**

depthWrite 속성을 false로 설정해 그림자끼리 충돌하는 현상을 막습니다. 이 충돌 현상은 다른 글에서 더 자세히 이야기할 거예요. 그림자는 빛을 반사하지 않으니 MeshBasicMaterial을 사용합니다.

**이런, 그림자 일부가 잘려나간 것이 보이나요? 이는 빛의 시점에서 장면을 렌더링해 그림자 맵을 만들기 때문입니다.** 위 예제를 예로 들면 DirectionalLight의 위치에 카메라가 있고, 해당 조명의 목표를 바라보는 것이죠.
조명의 그림자에는 별도의 카메라가 있고, 이전에 카메라에 관한 글에서 설명한 것처럼 일정 공간 안의 그림자만 렌더링합니다. 위 예제에서는 그 공간이 너무 좁은 것이죠.

어째서 width와 height를 완전 큰 값으로 설정해 모든 요소를 다 포함하도록 하지 않는 걸까요? width와 height를 100 정도로 설정하면 그림자의 해상도가 낮아집니다.
왜 그림자의 해상도가 낮아졌을까요?

**이는 그림자 관련 설정을 할 때 항상 주의해야하는 부분입니다. 사실 그림자 맵은 그림자가 포함된 하나의 텍스처입니다. 이 텍스처는 크기가 정해져 있죠.** 위 예제에서 카메라의 공간을 늘리면, 이 텍스처 또한 늘어납니다. 다시 말해 공간을 크게 설정할수록 그림자가 더 각져 보일 거라는 얘기죠.

그림자 맵의 해상도는 light.shadow.mapSize 속성의 width와 height 속성으로 설정합니다(기본값은 512x512). **그림자 맵은 크게 설정할수록 메모리를 많이 차지하고, 연산이 더 복잡해지므로 가능한 작게 설정하는 것이 좋습니다. 이는 그림자용 카메라의 공간도 마찬가지죠. 작을 수록 그림자의 퀄리티가 좋아질 테니 가능한 공간을 작게 설정하는 것이 좋습니다.** 또한 기기마다 렌더링할 수 있는 텍스처의 용량이 정해져 있으니 주의해야 합니다. Three.js에서 이 용량은 renderer.capabilities.maxTextureSize로 확인할 수 있습니다.

SpotLight는 그림자용 카메라로 PerspectiveCamera(원근 카메라)를 사용합니다. DirectionalLight의 그림자용 카메라는 거의 모든 속성을 직접 변경할 수 있었지만, SpotLight의 그림자용 카메라는 조명 속성의 영향을 받습니다. 카메라의 fov 속성은 SpotLight의 angle 속성과 직접 연결되어 있죠. aspect는 그림자 맵의 크기에 따라 자동으로 정해집니다.

## [fog](https://threejs.org/manual/#ko/fog)

**3D 엔진에서 안개란, 일반적으로 카메라로부터의 거리에 따라 특정 색상으로 점차 변화하는 것을 말합니다.** Three.js에서는 Fog나 FogExp2 객체를 생성한 뒤, 장면(scene)의 fog 속성에 지정해 안개를 사용합니다.

**Fog는 인자로 near와 far값을 받는데, 이는 카메라로부터의 거리값입니다. near값보다 가까운 공간은 안개의 영향이 전혀 없고, far값보다 먼 공간은 완전히 안개에 뒤덮입니다.** near와 far 사이의 공간에 있는 물체 또는 물체의 일부는 점차 안개의 색으로 변화하죠.

**FogExp2는 카메라에서 멀어질수록 안개의 강도가 강해집니다.**

두 가지 안개 모두 마찬가지로, 안개를 사용하려면 장면의 속성에 지정해야 합니다.

```
const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;  // 하양
  const near = 10;
  const far = 100;
  scene.fog = new THREE.Fog(color, near, far);
}
```

FogExp2의 경우는 다음처럼 쓸 수 있죠.

```
const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;
  const density = 0.1;
  scene.fog = new THREE.FogExp2(color, density);
}
```

FogExp2가 더 현실적이긴 하나, 보통 안개의 범위를 특정하기 쉬운 Fog를 더 많이 사용합니다.

**한 가지 알아둬야 하는 건 안개는 렌더링되는 물체라는 점입니다. 안개는 물체의 픽셀을 렌더링할 때 같이 렌더링되는데, 이 말은 장면에 특정 색상의 안개 효과를 주려면 안개와 배경색 둘 다 같은 색으로 지정해야 한다는 겁니다.** 배경색은 scene.background 속성을 THREE.Color 인스턴스로 지정해 바꿀 수 있습니다.

**추가로 재질(material)에는 불린 타입의 fog 속성이 있습니다. 해당 재질로 렌더링되는 물체가 안개의 영향을 받을지의 여부를 결정하는 속성이죠.** "안개 효과를 없애버리면 그만 아닌가?" 생각할 수 있지만, 3D 운전 시뮬레이터를 만드는 경우를 상상해봅시다. 차 밖은 안개가 자욱하더라도 차 안에서 볼 때 차 내부는 깔끔해야 할 수도 있죠.

## [rendertargets](https://threejs.org/manual/#ko/rendertargets)

**Three.js의 렌더 타겟이란, 직접 렌더링할 수 있는 텍스처(texture)를 말합니다.** 한 번 텍스처로 렌더링한 뒤에는 다른 텍스처처럼 사용할 수 있죠.

- 렌더 타겟의 용도는 무궁무진합니다. 그림자가 렌더 타겟을 사용하고, 피킹(picking)도 렌더 타겟을 사용할 수 있죠.
- 많은 후처리 효과를 사용할 때 렌더 타겟이 필수 요소인 경우도 있고, 차의 후사경(rear view mirror, 백미러)이나 모니터 화면 등에도 렌더 타겟을 활용할 수 있습니다.

이번 글은 여기까지입니다. 마지막으로 WebGLRenderTarget을 사용할 때의 주의해야 할 점 몇 가지만 살펴보고 끝내도록 하죠.

- 기본적으로 WebGLRenderTarget은 2개의 텍스처를 생성합니다.
  - 하나는 색상 텍스처이고,
  - 다른 하나는 깊이/스텐실(depth/stencil) 텍스처이죠.
  - 깊이 텍스처나 스텐실 텍스처를 사용하지 않을 거라면 인스턴스 생성 시 옵션을 지정해 텍스처를 아예 생성하지 않도록 할 수 있습니다.
- 렌더 타겟의 크기를 바꿔야 한다면
  - 앞선 예제에서는 렌더 타겟을 생성할 때 고정 사이즈, 512x512를 사용했습니다. 하지만 후처리 등에서 렌더 타겟을 사용할 경우, canvas 크기와 렌더 타겟의 크기를 똑같이 설정하는 것이 일반적입니다.
  - 예제를 바탕으로 이를 구현하려면 canvas의 사이즈가 변경되었을 때 카메라와 렌더 타겟의 사이즈를 변경해주어야 하죠.

## [custom-buffergeometry](https://threejs.org/manual/#ko/custom-buffergeometry)

BufferGeometry는 Three.js 내의 모든 geometry를 나타냅니다(r125에서부터 Geometry가 제거되었습니다). 좀 더 자세히 말하면 특정 BufferAttribute라고 부르는 속성의 집합이죠.

**UV 매핑(UV mapping)은 2차원 그림을 3차원 모델로 만드는 3차원 모델링 프로세스이다.**

각 BufferAttribute는 위치(positions), 법선(normals), 색(colors), uv 데이터의 배열이고, 이들을 모으면 각 꼭지점에 대한 평행 배열 형식의 데이터가 됩니다.

모서리의 꼭지점을 공유하는 듯해도 사실 그렇지 않기 때문이죠. 필요한 꼭지점을 전부 생성한 후, 꼭지점 데이터를 평행 배열로 변환해 BufferAttribute를 만들고, 이를 BufferGeometry에 추가해야 합니다.

## [rendering-on-demand](https://threejs.org/manual/#ko/rendering-on-demand)

대부분의 개발자에게 이 주제는 너무 뻔할 수 있지만, 필요한 누군가를 위해 글을 써보려 합니다. **대부분의 Three.js 예제는 렌더링 과정을 계속 반복합니다. 그러니까 아래와 같이 재귀적으로 requestAnimationFrame 함수를 사용한다는 거죠.**

**애니메이션이 없는 경우라면 처음 한 번만 렌더링하고, 그 후에 변화가 있을 때만 렌더링하는 것이 가장 정확한 해결책일 겁니다.** 여기서 변화란 텍스처나 모델의 로딩이 끝났을 때, 외부에서 데이터를 받았을 때, 사용자가 카메라를 조정하거나, 설정을 바꾸거나, 인풋 값이 변경된 경우 등 다양하겠죠.

OrbitControls에는 관성(inertia) 옵션이 있습니다. enableDamping 속성을 true 설정하면 동작이 좀 더 부드러워지죠.

또한 OrbitControls가 부드러운 동작을 구현할 때 변경된 카메라 값을 계속 넘겨주도록 render 함수 안에서 controls.update 메서드를 호출해야 합니다. 하지만 이렇게 하면 change 이벤트가 발생했을 때 render 함수가 무한정 호출될 겁니다. controls가 change 이벤트를 보내면 render 함수가 호출되고, render 함수는 controls.update 메서드를 호출해 다시 change 이벤트를 보내게 만들 테니까요.

requestAnimationFrame이 직접 render 함수를 호출하게 하면 이 문제를 해결 할 수 있습니다. 너무 많은 프레임을 막기 위해 변수 하나를 두어 요청한 프레임이 없을 경우에만 프레임을 요청하도록 하면 되겠네요.

**이 글이 불필요한 렌더링 제거에 대한 개념을 조금이라도 잡아주었길 바랍니다. 보통 Three.js를 사용할 때는 이렇게 렌더링 루프를 제어할 일이 없습니다. 대게 게임 또는 애니메이션이 들어간 3D 컨텐츠이기 때문이죠. 하지만 지도나, 3D 에디터, 3D 그래프, 상품 목록 등에서는 이런 기법이 필요할 수도 있습니다.**

## [debugging-javascript](https://threejs.org/manual/#ko/debugging-javascript)

- 화면에 데이터 띄우기
- 쿼리 파라미터를 이용한 디버그 모드
- 디버거 사용법을 익혀라
  - 브라우저에는 전부 디버거가 있어 프로그램을 줄 단위로 실행하며 모든 변수를 검사할 수 있습니다.
- 디버거 등에서 NaN을 확인해라
- 코드를 까봐라!
  - three.min.js가 아닌 three.js를 쓰는 것을 추천합니다. 왜냐하면 three.min.js는 용량을 줄이기 위해 난독화와 압축이 적용된 형태거든요.
  - three.js가 용량이 더 크긴 하지만 디버깅에는 훨씬 유리합니다. 저도 문제가 있을 때는 대부분 three.js를 사용해 코드를 단계별로 살펴보는 편입니다.
- requestAnimationFrame을 렌더링 가장 마지막에 넣어라
  - 이런 방식을 사용한 가장 중요한 이유는, 이래야 에러가 났을 때 코드를 멈출 수 있기 때문입니다.
  - requestAnimationFrame을 상단에서 실행하면 에러가 나기 전에 이미 다른 프레임을 요청한 것이므로, 에러가 반복해 나타날 수 있습니다.
- 단위를 확인하라!
- 질문할 때 최소한으로, 완성된, 테스트할 수 있는 예제를 만들어라
  - MCVE에 맞춰 최소한으로(Minimal), 완성된(Complete), 테스트할 수 있는(Verifiable) 예제(Example)를 포함해야 합니다.
  - MCVE의 장점은 이렇게 예제를 만들다 문제가 해결되기도 한다는 겁니다. 불필요한 요소를 제거하고 에러를 재현할 수 있는 가장 작은 코드를 짜다 보면 문제의 원인이 밝혀지는 경우가 꽤 많거든요.
- MeshBasicMaterial을 사용하라
- 카메라의 near와 far 설정을 확인하라
- 장면이 카메라 앞에 있는지 확인하라
- 뭐든 카메라 앞에 배치해봐라
  - 이건 문제가 생겼는데 어떤 점이 문제일지 모를 때, 하나씩 천천히 요소를 추가해보라는 말입니다.
  - 만약 코드를 실행했는데 장면에 아무것도 보이지 않는다면 카메라 바로 앞에 간단한 요소를 배치해보세요.
