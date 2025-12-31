import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InteractiveCanvas } from '../InteractiveCanvas';
import {
  resetImageProcessingState,
  toggleCellActive,
  setCellsActive,
} from '../../../features/imageProcessing/imageProcessingSlice';
import useClassifier from '../../../hooks/useClassifier';
import {
  setBoardMode as setPathfinderBoardMode,
  setGridSize as setPathfinderGridSize,
  setCells as setPathfinderCells,
} from '../../../features/pathfinder/pathfinderSlice';
import {
  setBoardMode as setCodewordsBoardMode,
  initializeGrid as initializeCodewordsGrid,
} from '../../../features/codewords/codewordsSlice';

const CellClassifier = () => {
  const dispatch = useDispatch();
  const { extractedCells, finalImage } = useSelector((state) => state.imageProcessing);

  const { predictCanvas } = useClassifier();
  const [isPredicting, setIsPredicting] = React.useState(false);

  const handlePredict = async () => {
    setIsPredicting(true);
    const cells = Object.entries(extractedCells);
    const updates = {};

    // Create a temporary image element for prediction
    const img = new Image();

    for (const [key, cell] of cells) {
      if (!cell.image) continue;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = cell.image;
      });

      const prediction = await predictCanvas(img);
      if (prediction) {
        updates[key] = prediction.isActive;
      }
    }

    dispatch(setCellsActive(updates));
    setIsPredicting(false);
  };

  const handleFinish = () => {
    // Filter the cells that are active
    const activeCells = Object.values(extractedCells).filter((c) => c.active);
    console.log("Finished classification:", activeCells);
    dispatch(resetImageProcessingState());
  };

  const handleTransferPathfinder = () => {
    // 1. Calculate active cells
    const activeCellsList = Object.values(extractedCells).filter((c) => c.active);

    if (activeCellsList.length === 0) {
      alert("No active cells to transfer.");
      return;
    }

    // 2. Determine grid dimensions based on the max x and y found
    let maxX = 0;
    let maxY = 0;
    activeCellsList.forEach(cell => {
      if (cell.x > maxX) maxX = cell.x;
      if (cell.y > maxY) maxY = cell.y;
    });

    // Grid size is 1-based index (count), so +1 to max index
    // However, the user might want the original rowCount/colCount from the earlier step.
    // Since we don't have that in local scope easily (unless we select it), let's imply it from the cells.
    // Or better, just use the extractedCells full set to find max bounds which represents the grid.
    const allCells = Object.values(extractedCells);
    let gridW = 0;
    let gridH = 0;
    allCells.forEach(cell => {
      if (cell.x >= gridW) gridW = cell.x + 1;
      if (cell.y >= gridH) gridH = cell.y + 1;
    });

    // 3. Prepare the cellSet for pathfinder
    const newCellSet = {};
    activeCellsList.forEach(cell => {
      const id = `${cell.x},${cell.y}`; // Pathfinder uses "x,y" format
      newCellSet[id] = {
        id: id,
        gridPosition: { x: cell.x, y: cell.y },
        char: null,
        solutionChar: null,
      };
    });

    // 4. Dispatch actions to Pathfinder slice
    dispatch(setPathfinderBoardMode("grid"));
    dispatch(setPathfinderGridSize({ width: gridW, height: gridH }));
    dispatch(setPathfinderCells(newCellSet));

    // 5. Navigate to Pathfinder or give feedback
    alert(`Transferred ${activeCellsList.length} cells to Pathfinder!`);
    dispatch(resetImageProcessingState());
  };

  const handleTransferCodewords = () => {
    // 1. Calculate dimensions
    const allCells = Object.values(extractedCells);
    if (allCells.length === 0) {
      alert("No cells detected to transfer.");
      return;
    }

    let gridW = 0;
    let gridH = 0;
    allCells.forEach(cell => {
      if (cell.x >= gridW) gridW = cell.x + 1;
      if (cell.y >= gridH) gridH = cell.y + 1;
    });

    // 2. Build 2D grid data
    // 1 = white cell, 0 = black cell
    const gridData = Array.from({ length: gridH }, () => Array(gridW).fill(0));
    allCells.forEach(cell => {
      if (cell.active) {
        gridData[cell.y][cell.x] = 1;
      } else {
        gridData[cell.y][cell.x] = 0;
      }
    });

    // 3. Dispatch to Codewords
    dispatch(setCodewordsBoardMode("grid"));
    dispatch(initializeCodewordsGrid({ grid: gridData }));

    // 4. Feedback
    alert(`Transferred grid structure to Codewords!`);
    dispatch(resetImageProcessingState());
  };

  const handleDownload = () => {
    // Convert the object to an array for filtering and serialization
    const dataToDownload = Object.values(extractedCells);
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "cell_data.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas />
      </div>
      <div className="controls-row">
        <button onClick={handlePredict} disabled={isPredicting}>
          {isPredicting ? "Predicting..." : "Predict All"}
        </button>
        <button onClick={handleFinish}>Finish</button>
        <button onClick={handleTransferPathfinder}>Transfer to Pathfinder</button>
        <button onClick={handleTransferCodewords}>Transfer to Codewords</button>
        <button onClick={handleDownload}>Download JSON</button>
        <button onClick={() => {
          if (finalImage) {
            const link = document.createElement("a");
            link.setAttribute("href", finalImage);
            link.setAttribute("download", "preprocessed_image.png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }}>Download Image</button>
      </div>

      <DebugView cells={Object.values(extractedCells)} />
    </div>
  );
};

const DebugView = ({ cells }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="debug-view">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Debug View" : "Show Debug View (DEV Only)"}
      </button>

      {isOpen && (
        <div className="debug-grid">
          {cells.map((cell) => (
            <div key={`${cell.x}-${cell.y}`} className="debug-cell">
              <img src={cell.image} alt={`${cell.x},${cell.y}`} />
              <div className="debug-cell-info">
                {cell.x},{cell.y}
              </div>
              <div className="debug-cell-info">
                {cell.active ? "Act" : "Inact"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CellClassifier;
