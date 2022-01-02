# 다시 하는 ThreeJS 학습

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
