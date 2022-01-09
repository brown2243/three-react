import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import CameraPerspective from "components/Fundamentals/CameraPerspective";
import CameraOrthographic from "components/Fundamentals/CameraOrthographic";
import CameraOrthographic2 from "components/Fundamentals/CameraOrthographic2";
import CameraZfighting from "components/Fundamentals/CameraZfighting";
import Lights from "components/Fundamentals/Lights";
// import Materials from "components/Fundamentals/Materials";
import Primitives from "components/Fundamentals/Primitives";
import SceneGraph from "components/Fundamentals/SceneGraph";
import SceneGraphCar from "components/Fundamentals/SceneGraphCar";
import SceneGraphTank from "components/Fundamentals/SceneGraphTank";
import Textures from "components/Fundamentals/Textures";
import TexturesController from "components/Fundamentals/TexturesController";
import TexturesDots from "components/Fundamentals/TexturesDots";
import TexturesSix from "components/Fundamentals/TexturesSix";
import Shadow from "components/Fundamentals/Shadow";
import ShadowCamera from "components/Fundamentals/ShadowCamera";
import Fog from "components/Fundamentals/Fog";
import Rendertargets from "components/Fundamentals/Rendertargets";

const AppContainer = styled.section`
  width: 100vw;
  height: 100vh;
`;
const LinkContainer = styled.div`
  display: flex;
`;
const LinkListContainer = styled.div`
  margin-top: 20vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 30px;
  & > h1 {
    font-size: 52px;
  }
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
          <Route path="/fog" element={<Fog />} />
          <Route path="/Rendertargets" element={<Rendertargets />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;

function LinkList() {
  return (
    <LinkContainer>
      <LinkListContainer>
        <h1>Fundamentals</h1>
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
        <Link to="/fog">fog</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
      </LinkListContainer>
      <LinkListContainer>
        <h1>Tips</h1>
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
        <Link to="/fog">fog</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
      </LinkListContainer>
      <LinkListContainer>
        <h1>Examples</h1>
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
        <Link to="/fog">fog</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
        <Link to="/Rendertargets">Rendertargets</Link>
      </LinkListContainer>
    </LinkContainer>
  );
}
