import styled from "styled-components";
import RendererBox from "./components/RendererBox";

const AppContainer = styled.section`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <RendererBox />
    </AppContainer>
  );
}

export default App;
