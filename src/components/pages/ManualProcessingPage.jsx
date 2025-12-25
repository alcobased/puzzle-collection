import { useState, useRef } from "react";
import useScript from "../../hooks/useScript";
import { InteractiveCanvas } from "../common/InteractiveCanvas";
import { fix_perspective, trim_image } from "../../features/opencv/manualProcessing";
import { detectAndOverlayGrid, extractGridStructure, overlayGrid } from "../../features/opencv/gridProcessing";
import "../../styles/ManualProcessingPage.css";

const ManualProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const [imageSrc, setImageSrc] = useState(null);
  const [stage, setStage] = useState("load"); // 'load', 'perspective', 'trimming', 'grid-detection', 'extraction', 'done'
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
  const [sizeMultiplier, setSizeMultiplier] = useState(2);

  // Grid Detection State
  const [gridImage, setGridImage] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [bias, setBias] = useState(0.9);

  // Extraction State
  const [extractedCells, setExtractedCells] = useState([]);
  const [extractionThreshold, setExtractionThreshold] = useState(0);
  const [isBoardLighter, setIsBoardLighter] = useState(true);

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

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            finalImageSrc = canvas.toDataURL();
          }

          if (skipPreprocessing) {
            setFinalImage(finalImageSrc);
            setStage("grid-detection");
            setStatusText("Detecting grid...");
            // Reset other states that might be leftover
            setPerspectivePoints([]);
            setTrimmingPoints([]);
            setLastPoint(null);
            setProcessedDimensions(null);
            setGridImage(null);
            setRowCount(0);
            setColCount(0);
            setExtractedCells([]);

            performGridDetection(finalImageSrc, bias);
          } else {
            setImageSrc(finalImageSrc);
            setStage("perspective");
            setStatusText("Step 1 of 2: Mark four points on the grid to fix perspective.");
            setPerspectivePoints([]);
            setTrimmingPoints([]);
            setFinalImage(null);
            setLastPoint(null);
            setProcessedDimensions(null);
          }
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
    const result = fix_perspective(imgRef.current, perspectivePoints, window.cv, sizeMultiplier);
    setFinalImage(result);
    setStage("trimming");
    setStatusText("Step 2 of 2: Mark top, right, bottom, and left edges to trim.");
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
  }

  const performGridDetection = async (imgSrc, currentBias) => {
    setStatusText("Detecting grid...");
    const { imageWithGrid, rowCount, columnCount } = await detectAndOverlayGrid(imgSrc, currentBias);
    setGridImage(imageWithGrid);
    setRowCount(rowCount);
    setColCount(columnCount);
    setStatusText("Grid detection complete. Adjust bias if needed.");
  };

  const handleBiasChange = async (e) => {
    const newBias = parseFloat(e.target.value);
    setBias(newBias);
    // Debouncing could be added here, but for now we'll just run it
    // We need to use the trimmed image (finalImage) as source, not the gridImage
    if (finalImage) {
      await performGridDetection(finalImage, newBias);
    }
  };

  const handleManualGridUpdate = async (type, value) => {
    const val = parseInt(value) || 0;
    let newRow = rowCount;
    let newCol = colCount;

    if (type === 'row') {
      setRowCount(val);
      newRow = val;
    } else {
      setColCount(val);
      newCol = val;
    }

    if (finalImage && newRow > 0 && newCol > 0) {
      const newOverlay = await overlayGrid(finalImage, newRow, newCol);
      setGridImage(newOverlay);
    }
  };



  const handleGridConfirm = async () => {
    setStatusText("Extracting grid structure...");
    // Use the clean trimmed image for extraction, not the one with red lines
    const { cells, threshold, isBoardLighter: detectedLighter } = await extractGridStructure(finalImage, rowCount, colCount);

    setExtractedCells(cells);
    setExtractionThreshold(threshold);
    setIsBoardLighter(detectedLighter);



    setStage("extraction");
    setStatusText("Step 4 of 4: Verify extracted board shape.");
  };

  const handleExtractionConfirm = () => {
    setStage("done");
    setStatusText("Processing complete.");

    const img = new Image();
    img.onload = () => {
      setProcessedDimensions({ width: img.width, height: img.height });
    }
    img.src = finalImage;
  };

  const handleCellClick = (r, c) => {
    const newCells = extractedCells.map(cell => {
      if (cell.row === r && cell.col === c) {
        return { ...cell, active: !cell.active };
      }
      return cell;
    });
    setExtractedCells(newCells);
  };

  const downloadSegment = (imgSrc, r, c, rows, cols) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const cellWidth = img.width / cols;
      const cellHeight = img.height / rows;

      // Expand by 15% margin
      const marginX = cellWidth * 0.15;
      const marginY = cellHeight * 0.15;

      const sourceX = Math.max(0, c * cellWidth - marginX);
      const sourceY = Math.max(0, r * cellHeight - marginY);

      // Calculate width/height ensuring we don't go out of bounds
      // The logical width is cellWidth + 2*margin, but we must clip to image boundaries
      const sourceW = Math.min(img.width - sourceX, cellWidth + 2 * marginX);
      const sourceH = Math.min(img.height - sourceY, cellHeight + 2 * marginY);

      canvas.width = sourceW;
      canvas.height = sourceH;

      ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `segment_r${r}_c${c}_expanded.png`;
      link.href = dataUrl;
      link.click();
    };
    img.src = imgSrc;
  };

  const saveTrainingDataset = async () => {
    if (process.env.NODE_ENV !== "development") return;

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cellWidth = img.width / colCount;
      const cellHeight = img.height / rowCount;

      // Expand by 15% margin
      const marginX = cellWidth * 0.15;
      const marginY = cellHeight * 0.15;

      const timestamp = Date.now();
      let savedCount = 0;

      for (const cell of extractedCells) {
        const sourceX = Math.max(0, cell.col * cellWidth - marginX);
        const sourceY = Math.max(0, cell.row * cellHeight - marginY);

        const sourceW = Math.min(img.width - sourceX, cellWidth + 2 * marginX);
        const sourceH = Math.min(img.height - sourceY, cellHeight + 2 * marginY);

        canvas.width = sourceW;
        canvas.height = sourceH;

        ctx.clearRect(0, 0, sourceW, sourceH);
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

        const cellDataUrl = canvas.toDataURL('image/png');
        const folder = cell.active ? 'active' : 'inactive';
        const filename = `src/features/opencv/${folder}/segment_${timestamp}_r${cell.row}_c${cell.col}.png`;

        try {
          await fetch('/api/save-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, content: cellDataUrl })
          });
          savedCount++;
        } catch (err) {
          console.error("Failed to save segment:", err);
        }
      }
      alert(`Saved ${savedCount} segments to src/features/opencv/{active,inactive}/`);
    };
    img.src = finalImage;
  };

  const handleCellContextMenu = (e, r, c) => {
    if (process.env.NODE_ENV !== "development") return;
    e.preventDefault();

    if (window.confirm(`Download segment for cell [${r}, ${c}] with expanded margin?`)) {
      downloadSegment(finalImage, r, c, rowCount, colCount);
    }
  };

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
    setGridImage(null);
    setRowCount(0);
    setColCount(0);
    setBias(0.9);
    setExtractedCells([]);
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
          <div className="perspective-controls">
            <label htmlFor="size-multiplier">Canvas Size Multiplier:</label>
            <input
              type="number"
              id="size-multiplier"
              value={sizeMultiplier}
              onChange={(e) => setSizeMultiplier(parseFloat(e.target.value))}
              min="1"
              step="0.1"
            />
          </div>
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
              onImageLoaded={() => { }} // Dimensions are already known
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
    } else if (stage === "grid-detection") {
      return (
        <div className="manual-stage">
          <div className="interactive-canvas-container">
            {/* Show the image with grid overlay */}
            <img src={gridImage || finalImage} alt="Grid Detection" style={{ maxWidth: '100%' }} />
          </div>

          <div className="grid-controls">
            <p>Detected: {rowCount} rows x {colCount} columns</p>
            <div className="control-group">
              <label htmlFor="bias-slider">Detection Bias: {bias}</label>
              <input
                type="range"
                id="bias-slider"
                min="0.5"
                max="1.5"
                step="0.05"
                value={bias}
                onChange={handleBiasChange}
              />
            </div>

            <div className="manual-override-group" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div className="control-group">
                <label htmlFor="row-input">Rows:</label>
                <input
                  type="number"
                  id="row-input"
                  value={rowCount}
                  onChange={(e) => handleManualGridUpdate('row', e.target.value)}
                  min="1"
                />
              </div>
              <div className="control-group">
                <label htmlFor="col-input">Cols:</label>
                <input
                  type="number"
                  id="col-input"
                  value={colCount}
                  onChange={(e) => handleManualGridUpdate('col', e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </div>

          <button onClick={handleGridConfirm}>
            Confirm Grid
          </button>
        </div>
      );
    } else if (stage === "extraction") {
      return (
        <div className="manual-stage">
          <div className="extraction-container" style={{ position: 'relative', display: 'inline-block' }}>
            <img src={finalImage} alt="Base for extraction" style={{ display: 'block', maxWidth: '100%' }} />
            <div className="extraction-overlay" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateRows: `repeat(${rowCount}, 1fr)`,
              gridTemplateColumns: `repeat(${colCount}, 1fr)`
            }}>
              {extractedCells.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                  onContextMenu={(e) => handleCellContextMenu(e, cell.row, cell.col)}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: cell.active ? 'rgba(0, 255, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer'
                  }}
                  title={`Row: ${cell.row}, Col: ${cell.col}, Mean: ${cell.mean.toFixed(1)}`}
                />
              ))}
            </div>
          </div>

          <div className="extraction-controls">
            <p>Click cells to toggle their state manually.</p>
            <p>Threshold: {extractionThreshold} | Mode: {isBoardLighter ? "Board is Lighter" : "Board is Darker"}</p>
            {process.env.NODE_ENV === "development" && (
              <button onClick={saveTrainingDataset} style={{ marginTop: '0.5rem', backgroundColor: '#28a745' }}>
                Save All Segments (Train Data)
              </button>
            )}
          </div>

          <button onClick={handleExtractionConfirm}>
            Finish Processing
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
          <div className="upload-section">
            {process.env.NODE_ENV === "development" && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={skipPreprocessing}
                  onChange={(e) => setSkipPreprocessing(e.target.checked)}
                />
                Image is already cropped & corrected
              </label>
            )}
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
        ) : null}
        {stage === 'done' && <button onClick={handleReset}>Start Over</button>}
      </div>
      {renderCurrentStage()}
    </div>
  );
};

export default ManualProcessingPage;
