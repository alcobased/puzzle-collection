import { useState, useRef } from "react";
import useScript from "../../hooks/useScript";
import { InteractiveCanvas } from "../common/InteractiveCanvas";
import { fix_perspective } from "../../features/opencv/manualProcessing";
import "../../styles/ManualProcessingPage.css";

const ManualProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const [imageSrc, setImageSrc] = useState(null);
  const [stage, setStage] = useState("load"); // 'load', 'perspective', 'done'
  const [perspectivePoints, setPerspectivePoints] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [statusText, setStatusText] = useState("Please load an image to begin.");
  const canvasRef = useRef(null);

  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [lastPoint, setLastPoint] = useState(null);
  const [processedDimensions, setProcessedDimensions] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setStage("perspective");
        setStatusText("Step 1 of 1: Mark four points on the grid to fix perspective.");
        setPerspectivePoints([]);
        setFinalImage(null);
        setLastPoint(null);
        setProcessedDimensions(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoaded = ({ width, height }) => {
    setOriginalDimensions({ width, height });
  };

  const handleCanvasClick = (e) => {
    if (stage === "perspective" && perspectivePoints.length < 4) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      const newPoint = { x, y };
      setPerspectivePoints([...perspectivePoints, newPoint]);
      setLastPoint(newPoint);
    }
  };

  const handlePerspectiveConfirm = () => {
    if (!window.cv || !canvasRef.current) return;
    setStatusText("Correcting perspective...");
    const final = fix_perspective(canvasRef.current, perspectivePoints, window.cv);
    setFinalImage(final);
    setStage("done");
    setStatusText("Processing complete.");

    const img = new Image();
    img.onload = () => {
        setProcessedDimensions({width: img.width, height: img.height});
    }
    img.src = final;
  };

  const handleReset = () => {
    setImageSrc(null);
    setStage("load");
    setStatusText("Please load an image to begin.");
    setPerspectivePoints([]);
    setFinalImage(null);
    setOriginalDimensions(null);
    setLastPoint(null);
    setProcessedDimensions(null);
  }

  const renderCurrentStage = () => {
    if (stage === "perspective") {
        return (
          <div className="manual-stage">
            <InteractiveCanvas
              ref={canvasRef}
              imageSrc={imageSrc}
              points={perspectivePoints}
              onCanvasClick={handleCanvasClick}
              onImageLoaded={handleImageLoaded}
            />
            <p>Points selected: {perspectivePoints.length} / 4</p>
            <button 
                onClick={handlePerspectiveConfirm} 
                disabled={perspectivePoints.length !== 4}
            >
              {'Fix Perspective'}
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