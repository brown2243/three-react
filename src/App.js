import styled from "styled-components";
import Lenderer from "./components/Lenderer";

const AppContainer = styled.section`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Lenderer />
    </AppContainer>
  );
}

export default App;
