import React, { useRef } from "react";
import RendererBox from "./RendererBox";

function Materials() {
  const canvasRef = useRef(null);

  return <RendererBox canvasRef={canvasRef} />;
}

export default Materials;
