# 다시 하는 ThreeJS 학습

## [custom-buffergeometry](https://threejs.org/manual/#ko/custom-buffergeometry)

BufferGeometry는 Three.js 내의 모든 geometry를 나타냅니다(r125에서부터 Geometry가 제거되었습니다). 좀 더 자세히 말하면 특정 BufferAttribute라고 부르는 속성의 집합이죠.

**UV 매핑(UV mapping)은 2차원 그림을 3차원 모델로 만드는 3차원 모델링 프로세스이다.**

각 BufferAttribute는 위치(positions), 법선(normals), 색(colors), uv 데이터의 배열이고, 이들을 모으면 각 꼭지점에 대한 평행 배열 형식의 데이터가 됩니다.

모서리의 꼭지점을 공유하는 듯해도 사실 그렇지 않기 때문이죠. 필요한 꼭지점을 전부 생성한 후, 꼭지점 데이터를 평행 배열로 변환해 BufferAttribute를 만들고, 이를 BufferGeometry에 추가해야 합니다.
