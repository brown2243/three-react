import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Primitives from "./components/Primitives";
import SceneGraph from "./components/SceneGraph";

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
      <Link to="/"></Link>
      <Link to="/"></Link>
      <Link to="/"></Link>
      <Link to="/"></Link>
    </LinkListContainer>
  );
}
