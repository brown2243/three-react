# 다시 하는 ThreeJS 학습

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
