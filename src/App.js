import React, { useState, useEffect } from "react";
import fx from "glfx";

const App = () => {
  const [sourceImg, setSourceImg] = useState(null);
  const canvasRef = React.useRef(null);
  const experimentCanvasRef = React.useRef(null);

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "doug.png";
    } else {
      var canvas = fx.canvas();
      var texture = canvas.texture(sourceImg);

      // apply the ink filter
      canvas.draw(texture).ink(0.52).update();

      const displayCanvas = canvasRef.current;
      displayCanvas.width = sourceImg.width;
      displayCanvas.height = sourceImg.height;
      const ctx = displayCanvas.getContext("2d");
      drawCanvas(ctx, canvas);

      const inkCanvas = createInkCanvas(canvas);
      const displayCanvas2 = experimentCanvasRef.current;
      displayCanvas2.width = sourceImg.width;
      displayCanvas2.height = sourceImg.height;
      const ctx2 = displayCanvas2.getContext("2d");
      drawCanvas(ctx2, inkCanvas);
    }
  }, [sourceImg]);

  return (
    <div>
      <canvas ref={experimentCanvasRef} />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default App;

const drawCanvas = (ctx, source) => {
  if (!source) return;

  ctx.drawImage(source, 0, 0);
};

const createInkCanvas = (inputCanvas) => {
  if (!inputCanvas) return;

  const { width: inputW, height: inputH } = inputCanvas;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = inputW;
  tempCanvas.height = inputH;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(inputCanvas, 0, 0);

  const inputCtx = tempCanvas.getContext("2d");
  if (!inputCtx) return;

  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;
  let r, g, b, outColour;
  for (let i = 0; i < pixels.length; i += 4) {
    r = pixels[i];
    g = pixels[i + 1];
    b = pixels[i + 2];

    if (r === 0 && g === 0 && b === 0) {
      outColour = 0;
    } else {
      outColour = 255;
    }

    pixels[i] = outColour;
    pixels[i + 1] = outColour;
    pixels[i + 2] = outColour;
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(imgData, 0, 0);

  return outputCanvas;
};
