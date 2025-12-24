import { useState, useRef } from "react";
import { processImage } from "../../features/opencv/imageProcessing";
import useScript from "../../hooks/useScript";
import "./ImageProcessingPage.css";

const ImageProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);
  const [blurKernelSize, setBlurKernelSize] = useState(5);
  const [adaptiveThresholdBlockSize, setAdaptiveThresholdBlockSize] = useState(11);
  const [adaptiveThresholdC, setAdaptiveThresholdC] = useState(20);

  // Visualization Refs
  const grayCanvasRef = useRef(null);
  const threshCanvasRef = useRef(null);
  const perspectiveCanvasRef = useRef(null); // Renamed from rotatedCanvasRef
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
        perspectiveCanvasRef, // Updated ref
        linesCanvasRef,
        finalCanvasRef,
      },
      {
        blurKernelSize,
        adaptiveThresholdBlockSize,
        adaptiveThresholdC,
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
        <div className='control-groups-wrapper'>
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
              aria-describedby='blurKernel-tooltip'
            />
            <div role='tooltip' id='blurKernel-tooltip' className='tooltip'>
              Controls the size of the median blur kernel. Larger values create a
              more blurred image, which can help in reducing noise. Must be an odd
              number.
            </div>
          </div>
          <div className='control-group'>
            <label htmlFor='threshBlockSize'>
              Adaptive Thresh Block Size: {adaptiveThresholdBlockSize}
            </label>
            <input
              type='range'
              id='threshBlockSize'
              min='3'
              max='31'
              step='2'
              value={adaptiveThresholdBlockSize}
              onChange={(e) =>
                setAdaptiveThresholdBlockSize(parseInt(e.target.value, 10))
              }
              aria-describedby='threshBlockSize-tooltip'
            />
            <div
              role='tooltip'
              id='threshBlockSize-tooltip'
              className='tooltip'
            >
              Sets the size of the pixel neighborhood used to calculate the
              threshold. Must be an odd number. Larger values are better for
              variable illumination.
            </div>
          </div>
          <div className='control-group'>
            <label htmlFor='threshC'>
              Adaptive Thresh C: {adaptiveThresholdC}
            </label>
            <input
              type='range'
              id='threshC'
              min='-10'
              max='30'
              step='1'
              value={adaptiveThresholdC}
              onChange={(e) =>
                setAdaptiveThresholdC(parseInt(e.target.value, 10))
              }
              aria-describedby='threshC-tooltip'
            />
            <div role='tooltip' id='threshC-tooltip' className='tooltip'>
              A constant subtracted from the mean. It can be positive or negative.
              Fine-tunes the threshold, useful for adjusting for lighting
              conditions.
            </div>
          </div>
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
        alt='source'
        style={{ display: "none" }}
      />

      <div className='canvas-grid'>
        <section className='canvas-section'>
          <h4>1. Grayscale & Blur</h4>
          <canvas ref={grayCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>2. Adaptive Threshold</h4>
          <canvas ref={threshCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>3. Perspective Correction</h4> 
          <canvas ref={perspectiveCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>4. Extracted Skeleton & BBox</h4>
          <canvas ref={linesCanvasRef} className='canvas-style' />
        </section>
        <section className='canvas-section'>
          <h4>5. Final Normalized Board</h4>
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
