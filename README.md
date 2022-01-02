# 다시 하는 ThreeJS 학습

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
