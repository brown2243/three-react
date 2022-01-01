import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import RendererBox from "./components/RendererBox";

const AppContainer = styled.section`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element={<RendererBox />} />
          {/* <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} /> */}
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
