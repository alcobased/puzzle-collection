import { useState, useRef } from "react";
import useScript from "../../hooks/useScript";
import { InteractiveCanvas } from "../common/InteractiveCanvas";
import { fix_perspective, trim_image } from "../../features/opencv/manualProcessing";
import "../../styles/ManualProcessingPage.css";

const ManualProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const [imageSrc, setImageSrc] = useState(null);
  const [stage, setStage] = useState("load"); // 'load', 'perspective', 'trimming', 'done'
  const [perspectivePoints, setPerspectivePoints] = useState([]);
  const [trimmingPoints, setTrimmingPoints] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [statusText, setStatusText] = useState("Please load an image to begin.");
  const canvasRef = useRef(null);
  const magnifierRef = useRef(null);
  const imgRef = useRef(null);

  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [lastPoint, setLastPoint] = useState(null);
  const [processedDimensions, setProcessedDimensions] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_PIXELS = 2_000_000;
          const currentPixels = img.width * img.height;
          let finalImageSrc = img.src;

          if (currentPixels > MAX_PIXELS) {
            const scaleRatio = Math.sqrt(MAX_PIXELS / currentPixels);
            const newWidth = Math.floor(img.width * scaleRatio);
            const newHeight = Math.floor(img.height * scaleRatio);

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            finalImageSrc = canvas.toDataURL();
          }

          setImageSrc(finalImageSrc);
          setStage("perspective");
          setStatusText("Step 1 of 2: Mark four points on the grid to fix perspective.");
          setPerspectivePoints([]);
          setTrimmingPoints([]);
          setFinalImage(null);
          setLastPoint(null);
          setProcessedDimensions(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoaded = ({ width, height }) => {
    setOriginalDimensions({ width, height });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    const newPoint = { x, y };

    if (stage === "perspective" && perspectivePoints.length < 4) {
      setPerspectivePoints([...perspectivePoints, newPoint]);
    } else if (stage === "trimming" && trimmingPoints.length < 4) {
      setTrimmingPoints([...trimmingPoints, newPoint]);
    }
    setLastPoint(newPoint);
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current || !magnifierRef.current) return;
    const canvas = canvasRef.current;
    const magnifier = magnifierRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    magnifier.style.display = "block";
    magnifier.style.left = e.clientX + 10 + "px";
    magnifier.style.top = e.clientY + 10 + "px";

    magnifier.style.backgroundImage = `url(${canvas.toDataURL()})`;
    const zoom = 2;
    magnifier.style.backgroundSize = `${canvas.width * zoom}px ${canvas.height * zoom}px`;
    magnifier.style.backgroundPosition = `-${x * zoom - 75}px -${y * zoom - 75}px`;
  };

  const handleMouseLeave = () => {
    if (magnifierRef.current) {
      magnifierRef.current.style.display = "none";
    }
  };

  const handlePerspectiveConfirm = () => {
    if (!window.cv || !imgRef.current) return;
    setStatusText("Correcting perspective...");
    const result = fix_perspective(imgRef.current, perspectivePoints, window.cv);
    setFinalImage(result);
    setStage("trimming");
    setStatusText("Step 2 of 2: Mark top, right, bottom, and left edges to trim.");
  };

  const handleTrimConfirm = () => {
      if (!window.cv || !imgRef.current) return;
      setStatusText("Trimming image...");
      const result = trim_image(imgRef.current, trimmingPoints, window.cv);
      setFinalImage(result);
      setStage("done");
      setStatusText("Processing complete.");

      const img = new Image();
      img.onload = () => {
        setProcessedDimensions({width: img.width, height: img.height});
      }
      img.src = result;
  }

  const handleReset = () => {
    setImageSrc(null);
    setStage("load");
    setStatusText("Please load an image to begin.");
    setPerspectivePoints([]);
    setTrimmingPoints([]);
    setFinalImage(null);
    setOriginalDimensions(null);
    setLastPoint(null);
    setProcessedDimensions(null);
  }

  const renderCurrentStage = () => {
    if (stage === "perspective") {
        return (
          <div className="manual-stage">
            <div className="interactive-canvas-container">
              <InteractiveCanvas
                ref={canvasRef}
                imgRef={imgRef}
                imageSrc={imageSrc}
                points={perspectivePoints}
                stage={stage}
                onCanvasClick={handleCanvasClick}
                onImageLoaded={handleImageLoaded}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
              <div ref={magnifierRef} className="magnifier"></div>
            </div>
            <p>Points selected: {perspectivePoints.length} / 4</p>
            <button 
                onClick={handlePerspectiveConfirm} 
                disabled={perspectivePoints.length !== 4}
            >
              {'Fix Perspective'}
            </button>
          </div>
        );
    } else if (stage === "trimming") {
        return (
            <div className="manual-stage">
              <div className="interactive-canvas-container">
                <InteractiveCanvas
                  ref={canvasRef}
                  imgRef={imgRef} // This ref is now for the perspective-corrected image
                  imageSrc={finalImage} // Display the result from the last step
                  points={trimmingPoints}
                  stage={stage}
                  onCanvasClick={handleCanvasClick}
                  onImageLoaded={() => {}} // Dimensions are already known
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
                <div ref={magnifierRef} className="magnifier"></div>
              </div>
              <p>Points selected: {trimmingPoints.length} / 4 (Top, Right, Bottom, Left)</p>
              <button 
                  onClick={handleTrimConfirm} 
                  disabled={trimmingPoints.length !== 4}
              >
                {'Trim Image'}
              </button>
            </div>
          );
    } else if (stage === "done") {
        return (
          <div className="manual-stage">
            <h3>Result</h3>
            <img src={finalImage} alt="Final processed result" />
          </div>
        );
    } else {
        return null;
    }
  };

  return (
    <div className="manual-processing-page">
      <h2>Manual Image Processor</h2>
      <div className="manual-controls">
        <p>OpenCV Status: {openCVLoaded ? "🟢 Ready" : "🔴 Loading..."}</p>
        <p>Current Status: {statusText}</p>
        <div className="status-info">
            <h4>Status</h4>
            {originalDimensions && <p>Original Dims: {originalDimensions.width}x{originalDimensions.height}</p>}
            {lastPoint && <p>Last Point: ({lastPoint.x}, {lastPoint.y})</p>}
            {processedDimensions && <p>Processed Dims: {processedDimensions.width}x{processedDimensions.height}</p>}
        </div>
        {stage === 'load' || stage === 'done' ? (
          <input type="file" onChange={handleImageChange} accept="image/*" />
        ) : null}
         {stage === 'done' && <button onClick={handleReset}>Start Over</button>}
      </div>
      {renderCurrentStage()}
    </div>
  );
};

export default ManualProcessingPage;
