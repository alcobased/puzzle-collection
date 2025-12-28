import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import useScript from "../../hooks/useScript";
import useClassifier from "../../hooks/useClassifier";
import ImageUpload from "./stages/ImageUpload";
import PerspectiveCorrection from "./stages/PerspectiveCorrection";
import Trimming from "./stages/Trimming";
import GridDimensionDetector from "./stages/GridDimensionDetector";
import CellClassifier from "./stages/CellClassifier";
import {
  fix_perspective,
  trim_image,
} from "../../features/opencv/manualProcessing";
import {
  detectAndOverlayGrid,
  extractGridStructure,
} from "../../features/opencv/gridProcessing";
import {
  setBoardMode,
  setGridSize,
  setCells,
} from "../../features/pathfinder/pathfinderSlice";
import "../../styles/ManualProcessingPage.css";
import { AppConfig } from "../../config";

const ImageProcessingPage = () => {
  const dispatch = useDispatch();
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
          const currentPixels = img.width * img.height;
          let finalImageSrc = img.src;

          if (currentPixels > AppConfig.MAX_IMAGE_PIXELS) {
            const scaleRatio = Math.sqrt(
              AppConfig.MAX_IMAGE_PIXELS / currentPixels
            );
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
    const { cells } = await extractGridStructure(finalImage, rowCount, colCount);

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

  const handleRevert = () => {
    if (stage === "perspective") {
      setPerspectivePoints([]);
    } else if (stage === "trimming") {
      setTrimmingPoints([]);
    }
  };

  const handleFinish = () => {
    const newCells = {};
    extractedCells.forEach((cell) => {
      if (cell.active) {
        const id = `${cell.col},${cell.row}`;
        newCells[id] = {
          id,
          gridPosition: { x: cell.col, y: cell.row },
          char: null,
          solutionChar: null,
        };
      }
    });

    dispatch(setBoardMode("grid"));
    dispatch(setGridSize({ width: colCount, height: rowCount }));
    dispatch(setCells(newCells));
    setStage("done");
    setStatusText("Grid data sent to Pathfinder puzzle.");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = finalImage;
    link.download = "corrected-image.png";
    link.click();
  };

  const renderCurrentStage = () => {
    switch (stage) {
      case "perspective":
        return (
          <PerspectiveCorrection
            canvasRef={canvasRef}
            imgRef={imgRef}
            imageSrc={imageSrc}
            points={perspectivePoints}
            onCanvasClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            magnifierRef={magnifierRef}
            sizeMultiplier={sizeMultiplier}
            setSizeMultiplier={setSizeMultiplier}
            handlePerspectiveConfirm={handlePerspectiveConfirm}
          />
        );
      case "trimming":
        return (
          <Trimming
            canvasRef={canvasRef}
            imgRef={imgRef}
            imageSrc={finalImage}
            points={trimmingPoints}
            onCanvasClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            magnifierRef={magnifierRef}
            handleTrimConfirm={handleTrimConfirm}
          />
        );
      case "grid-detection":
        return (
          <GridDimensionDetector
            gridImage={gridImage}
            finalImage={finalImage}
            bias={bias}
            setBias={setBias}
            performGridDetection={performGridDetection}
            handleGridConfirm={handleGridConfirm}
            handleDownload={handleDownload}
          />
        );
      case "extraction":
        return (
          <CellClassifier
            finalImage={finalImage}
            rowCount={rowCount}
            colCount={colCount}
            extractedCells={extractedCells}
            setExtractedCells={setExtractedCells}
            handleFinish={handleFinish}
            handleDownload={handleDownload}
          />
        );
      default:
        return null;
    }
  };

  // Helper functions for UI interaction
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    const newPoint = { x, y };

    if (stage === "perspective" && perspectivePoints.length < 4) {
      setPerspectivePoints([...perspectivePoints, newPoint]);
    } else if (stage === "trimming" && trimmingPoints.length < 4) {
      setTrimmingPoints([...trimmingPoints, newPoint]);
    }
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
    magnifier.style.backgroundSize = `${canvas.width * zoom}px ${
      canvas.height * zoom
    }px`;
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
    const result = fix_perspective(
      imgRef.current,
      perspectivePoints,
      window.cv,
      sizeMultiplier
    );
    setFinalImage(result);
    setStage("trimming");
    setStatusText(
      "Step 2 of 2: Mark top, right, bottom, and left edges to trim."
    );
  };

  const handleTrimConfirm = async () => {
    if (!window.cv || !imgRef.current) return;
    setStatusText("Trimming image...");
    const result = trim_image(imgRef.current, trimmingPoints, window.cv);
    setFinalImage(result);

    // Initialize grid detection
    setStage("grid-detection");
    setStatusText("Step 3 of 3: Adjust grid detection settings.");
    await performGridDetection(result, bias);
  };

  return (
    <div className="manual-processing-page">
      <h2>Image Processor</h2>
      <div className="manual-controls">
        <p>
          OpenCV: {openCVLoaded ? "🟢" : "🔴"} | AI:{" "}
          {modelLoading ? "⏳" : "🟢"}
        </p>
        {stage === "load" && (
          <ImageUpload
            handleImageChange={handleImageChange}
            skipPreprocessing={skipPreprocessing}
            setSkipPreprocessing={setSkipPreprocessing}
          />
        )}
      </div>
      {statusText && <p className="status-text">{statusText}</p>}
      {renderCurrentStage()}
    </div>
  );
};

export default ImageProcessingPage;
