import { useState, useRef, useEffect } from "react";
import useScript from "../../hooks/useScript";
import useClassifier from "../../hooks/useClassifier";
import { InteractiveCanvas } from "../common/InteractiveCanvas";
import {
  fix_perspective,
  trim_image,
} from "../../features/opencv/manualProcessing";
import {
  detectAndOverlayGrid,
  extractGridStructure,
  overlayGrid,
} from "../../features/opencv/gridProcessing";
import "../../styles/ManualProcessingPage.css";

const ManualProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const { predictCanvas, loading: modelLoading } = useClassifier();

  const [imageSrc, setImageSrc] = useState(null);
  const [stage, setStage] = useState("load");
  const [perspectivePoints, setPerspectivePoints] = useState([]);
  const [trimmingPoints, setTrimmingPoints] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [statusText, setStatusText] = useState(
    "Please load an image to begin."
  );
  const canvasRef = useRef(null);
  const magnifierRef = useRef(null);
  const imgRef = useRef(null);

  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [lastPoint, setLastPoint] = useState(null);
  const [processedDimensions, setProcessedDimensions] = useState(null);
  const [sizeMultiplier, setSizeMultiplier] = useState(2);

  // Grid Detection State
  const [gridImage, setGridImage] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [bias, setBias] = useState(0.9);

  // Extraction State
  const [extractedCells, setExtractedCells] = useState([]);
  const [skipPreprocessing, setSkipPreprocessing] = useState(false);

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
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            finalImageSrc = canvas.toDataURL();
          }

          if (skipPreprocessing) {
            setFinalImage(finalImageSrc);
            setStage("grid-detection");
            // Reset relevant states
            setPerspectivePoints([]);
            setTrimmingPoints([]);
            setGridImage(null);
            performGridDetection(finalImageSrc, bias);
          } else {
            setImageSrc(finalImageSrc);
            setStage("perspective");
            setStatusText("Step 1: Mark four corners of the grid.");
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const performGridDetection = async (imgSrc, currentBias) => {
    setStatusText("Detecting grid...");
    const { imageWithGrid, rowCount, columnCount } = await detectAndOverlayGrid(
      imgSrc,
      currentBias
    );
    setGridImage(imageWithGrid);
    setRowCount(rowCount);
    setColCount(columnCount);
    setStatusText("Grid detection complete. Adjust settings if needed.");
  };

  const handleGridConfirm = async () => {
    if (modelLoading) {
      setStatusText("Waiting for AI Model...");
      return;
    }

    setStatusText("AI is analyzing segments...");
    const { cells } = await extractGridStructure(
      finalImage,
      rowCount,
      colCount
    );

    const img = new Image();
    img.src = finalImage;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const cellWidth = img.width / colCount;
    const cellHeight = img.height / rowCount;
    const marginX = cellWidth * 0.15;
    const marginY = cellHeight * 0.15;

    const aiProcessedCells = [];

    for (const cell of cells) {
      const sourceX = Math.max(0, cell.col * cellWidth - marginX);
      const sourceY = Math.max(0, cell.row * cellHeight - marginY);
      const sourceW = Math.min(img.width - sourceX, cellWidth + 2 * marginX);
      const sourceH = Math.min(img.height - sourceY, cellHeight + 2 * marginY);

      canvas.width = sourceW;
      canvas.height = sourceH;
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        0,
        0,
        sourceW,
        sourceH
      );

      const prediction = await predictCanvas(canvas);

      aiProcessedCells.push({
        ...cell,
        active: prediction.isActive,
        confidence: prediction.confidence,
      });
    }

    setExtractedCells(aiProcessedCells);
    setStage("extraction");
    setStatusText("AI Classification complete.");
  };

  const renderCurrentStage = () => {
    switch (stage) {
      case "perspective":
        return (
          <div className="manual-stage">
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
            <button
              onClick={handlePerspectiveConfirm}
              disabled={perspectivePoints.length !== 4}
            >
              Fix Perspective
            </button>
          </div>
        );
      case "grid-detection":
        return (
          <div className="manual-stage">
            <img
              src={gridImage || finalImage}
              alt="Grid"
              style={{ maxWidth: "100%" }}
            />
            <div className="grid-controls">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={bias}
                onChange={(e) => {
                  setBias(parseFloat(e.target.value));
                  performGridDetection(finalImage, parseFloat(e.target.value));
                }}
              />
              <button onClick={handleGridConfirm}>AI Classify</button>
            </div>
          </div>
        );
      case "extraction":
        return (
          <div className="manual-stage">
            <div
              className="extraction-container"
              style={{ position: "relative" }}
            >
              <img
                src={finalImage}
                alt="Base"
                style={{ display: "block", maxWidth: "100%" }}
              />
              <div
                className="extraction-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                  gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                }}
              >
                {extractedCells.map((cell, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setExtractedCells((prev) =>
                        prev.map((c) =>
                          c.row === cell.row && c.col === cell.col
                            ? { ...c, active: !c.active }
                            : c
                        )
                      );
                    }}
                    style={{
                      border:
                        cell.confidence < 80
                          ? "2px solid orange"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      backgroundColor: cell.active
                        ? "rgba(0, 255, 0, 0.35)"
                        : "rgba(255, 0, 0, 0.15)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <button onClick={() => setStage("done")}>Finish</button>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper functions for UI interaction
  const handleCanvasClick = (e) => {
    /* ... same as original ... */
  };
  const handleMouseMove = (e) => {
    /* ... same as original ... */
  };
  const handleMouseLeave = () => {
    if (magnifierRef.current) {
      magnifierRef.current.style.display = "none";
    }
  };
  const handlePerspectiveConfirm = () => {
    /* ... same as original ... */
  };
  const handleTrimConfirm = async () => {
    /* ... same as original ... */
  };
  const handleImageLoaded = ({ width, height }) =>
    setOriginalDimensions({ width, height });

  return (
    <div className="manual-processing-page">
      <h2>Manual Image Processor</h2>
      <div className="manual-controls">
        <p>
          OpenCV: {openCVLoaded ? "🟢" : "🔴"} | AI:{" "}
          {modelLoading ? "⏳" : "🟢"}
        </p>
        {stage === "load" && (
          <div className="upload-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={skipPreprocessing}
                onChange={(e) => setSkipPreprocessing(e.target.checked)}
              />
              Skip Preprocessing
            </label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
        )}
      </div>
      {renderCurrentStage()}
    </div>
  );
};

export default ManualProcessingPage;
