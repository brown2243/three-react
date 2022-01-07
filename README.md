# 다시 하는 ThreeJS 학습

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
