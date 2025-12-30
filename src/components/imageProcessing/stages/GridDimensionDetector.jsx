import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { extractGridStructure } from "../../../features/imageProcessing/imageProcessing";
import { InteractiveCanvas } from "../InteractiveCanvas";
import {
  setStage,
  setExtractedCells,
  setColCount,
  setRowCount,
} from "../../../features/imageProcessing/imageProcessingSlice";

const GridDimensionDetector = () => {
  const dispatch = useDispatch();
  const { finalImage, rowCount, colCount, cellPadding } = useSelector(
    (state) => state.imageProcessing
  );

  // Initialize cells with extracted image segments
  const handleGridConfirm = async () => {
    try {
      // Extract the grid cells as images
      const extractedImages = await extractGridStructure(
        finalImage,
        rowCount,
        colCount,
        cellPadding
      );

      const cells = {};
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
          const index = r * colCount + c;
          cells[`${c}-${r}`] = {
            x: c,
            y: r,
            active: false,
            image: extractedImages[index], // Save the dataURL
          };
        }
      }

      dispatch(setExtractedCells(cells));
      dispatch(setStage("classify"));
    } catch (err) {
      console.error("Failed to extract grid structure:", err);
      // You might want to handle error state in Redux here
    }
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
        <button onClick={handleGridConfirm}>Extract Cells</button>
        <button onClick={() => {
          if (finalImage) {
            const link = document.createElement("a");
            link.setAttribute("href", finalImage);
            link.setAttribute("download", "grid_image.png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }}>Download Image</button>
      </div>
    </div>
  );
};

export default GridDimensionDetector;
