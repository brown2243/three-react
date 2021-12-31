import React, { useRef } from "react";
import * as THREE from "three";

function Lenderer() {
  const canvasRef = useRef(null);

  return <div ref={canvasRef}></div>;
}

export default Lenderer;
