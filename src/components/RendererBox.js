import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  & > canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

function RendererBox({ canvasRef }) {
  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
    </Container>
  );
}

export default RendererBox;
