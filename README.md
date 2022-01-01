# 다시 하는 ThreeJS 학습

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
