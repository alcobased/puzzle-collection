import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { InteractiveCanvas } from "../InteractiveCanvas";
import {
  setStage,
  setExtractedCells,
  setColCount,
  setRowCount,
} from "../../../features/imageProcessing/imageProcessingSlice";

const GridDimensionDetector = () => {
  const dispatch = useDispatch();
  const { finalImage, rowCount, colCount } = useSelector(
    (state) => state.imageProcessing
  );

  const initializeCells = () => {
    const cells = {};
    for (let x = 0; x < colCount; x++) {
      for (let y = 0; y < rowCount; y++)
        cells[`${x}-${y}`] = {
          x,
          y,
          active: false,
        };
    }
    return cells;
  };

  const handleGridConfirm = () => {
    const cells = initializeCells();
    dispatch(setExtractedCells(cells));
    dispatch(setStage("classify"));
  };

  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas />
      </div>

      <div className="grid-controls">
        <label>Rows: {rowCount}</label>
        <input
          type="number"
          value={rowCount}
          onChange={(e) =>
            dispatch(setRowCount(parseInt(e.target.value, 10) || 0))
          }
        />
        <label>Cols: {colCount}</label>
        <input
          type="number"
          value={colCount}
          onChange={(e) =>
            dispatch(setColCount(parseInt(e.target.value, 10) || 0))
          }
        />
        <button onClick={handleGridConfirm}>AI Classify</button>
      </div>
    </div>
  );
};

export default GridDimensionDetector;
