import { useState, useRef, useEffect } from "react";
import { processImage } from "../../features/opencv/imageProcessing";
import useScript from "../../hooks/useScript";
import "./ImageProcessingPage.css";

const ImageProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);
  const [blurKernelSize, setBlurKernelSize] = useState(5);

  // Visualization Refs
  const grayCanvasRef = useRef(null);
  const threshCanvasRef = useRef(null);
  const linesCanvasRef = useRef(null);
  const finalCanvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const runPipeline = () => {
    const imgElement = imageRef.current;
    if (!openCVLoaded || !imageSrc || !window.cv || !imgElement) {
      return;
    }
    processImage(
      window.cv,
      imgElement,
      {
        grayCanvasRef,
        threshCanvasRef,
        linesCanvasRef,
        finalCanvasRef,
      },
      {
        blurKernelSize,
      }
    );
  };

  const handleProcessClick = () => {
    const imgElement = imageRef.current;
    if (imgElement) {
      if (imgElement.complete) {
        runPipeline();
      } else {
        imgElement.onload = runPipeline;
      }
    }
  };

  return (
    <div className='image-processing-page'>
      <h2>Codeword Board Shape Detector</h2>
      <div className='control-panel'>
        <p>OpenCV Status: {openCVLoaded ? "🟢 Ready" : "🔴 Loading..."}</p>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <div className='control-group'>
          <label htmlFor='blurKernel'>
            Median Blur Kernel: {blurKernelSize}
          </label>
          <input
            type='range'
            id='blurKernel'
            min='1'
            max='25'
            step='2'
            value={blurKernelSize}
            onChange={(e) => setBlurKernelSize(parseInt(e.target.value, 10))}
          />
        </div>
        <button
          onClick={handleProcessClick}
          disabled={!openCVLoaded || !imageSrc}
        >
          Process Image
        </button>
      </div>

      <img
        ref={imageRef}
        src={imageSrc}
        alt="source"
        style={{ display: "none" }}
      />

      <div className='canvas-grid'>
        <section className='canvas-section'>
          <h4>1. Grayscale & Blur</h4>
          <canvas ref={grayCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>2. Extracted Skeleton</h4>
          <canvas ref={threshCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>3. Verified Grid Lines</h4>
          <canvas ref={linesCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>4. Final Normalized Board</h4>
          <canvas
            ref={finalCanvasRef}
            className='canvas-style final-canvas'
          />
        </section>
      </div>
    </div>
  );
};

export default ImageProcessingPage;
