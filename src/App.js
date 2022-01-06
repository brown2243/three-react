import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import CameraPerspective from "./components/CameraPerspective";
import CameraOrthographic from "./components/CameraOrthographic";
import CameraOrthographic2 from "./components/CameraOrthographic2";
import CameraZfighting from "./components/CameraZfighting";
import Lights from "./components/Lights";
// import Materials from "./components/Materials";
import Primitives from "./components/Primitives";
import SceneGraph from "./components/SceneGraph";
import SceneGraphCar from "./components/SceneGraphCar";
import SceneGraphTank from "./components/SceneGraphTank";
import Textures from "./components/Textures";
import TexturesController from "./components/TexturesController";
import TexturesDots from "./components/TexturesDots";
import TexturesSix from "./components/TexturesSix";
import Shadow from "./components/Shadow";
import ShadowCamera from "./components/ShadowCamera";

const AppContainer = styled.section`
  width: 100vw;
  height: 100vh;
`;

const LinkListContainer = styled.div`
  margin-top: 20vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 30px;
`;

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element={<LinkList />} />
          <Route path="/primitives" element={<Primitives />} />
          <Route path="/scenegraph" element={<SceneGraph />} />
          <Route path="/scenegraph/car" element={<SceneGraphCar />} />
          <Route path="/scenegraph/tank" element={<SceneGraphTank />} />
          {/* <Route path="/materials" element={<Materials />} /> */}
          <Route path="/textures" element={<Textures />} />
          <Route path="/textures/six" element={<TexturesSix />} />
          <Route path="/textures/dots" element={<TexturesDots />} />
          <Route path="/textures/controller" element={<TexturesController />} />
          <Route path="/lights" element={<Lights />} />
          <Route path="/camera/perspective" element={<CameraPerspective />} />
          <Route path="/camera/z" element={<CameraZfighting />} />
          <Route path="/camera/orthographic" element={<CameraOrthographic />} />
          <Route
            path="/camera/orthographic/2"
            element={<CameraOrthographic2 />}
          />
          <Route path="/shadow" element={<Shadow />} />
          <Route path="/shadow/camera" element={<ShadowCamera />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;

function LinkList() {
  return (
    <LinkListContainer>
      <Link to="/primitives">primitives</Link>
      <Link to="/scenegraph">scenegraph</Link>
      <Link to="/scenegraph/car">scenegraph/car</Link>
      <Link to="/scenegraph/tank">scenegraph/tank</Link>
      {/* <Link to="/materials">materials</Link> */}
      <Link to="/textures">textures</Link>
      <Link to="/textures/six">textures/six</Link>
      <Link to="/textures/dots">textures/dots</Link>
      <Link to="/textures/controller">textures/controller</Link>
      <Link to="/lights">Lights</Link>
      <Link to="/camera/perspective">camera/perspective</Link>
      <Link to="/camera/z">camera/Zfighting</Link>
      <Link to="/camera/orthographic">camera/orthographic</Link>
      <Link to="/camera/orthographic/2">camera/orthographic2/2</Link>
      <Link to="/shadow">shadow</Link>
      <Link to="/shadow/camera">shadow/camera</Link>
    </LinkListContainer>
  );
}
