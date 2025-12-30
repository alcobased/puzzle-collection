import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setBias,
  setGridImage,
  setStage,
  setExtractedCells,
  setColCount,
  setRowCount
} from '../../../features/imageProcessing/imageProcessingSlice';
import {
  detectAndOverlayGrid,
  extractGridStructure,
} from "../../../features/imageProcessing/imageProcessing";

const GridDimensionDetector = () => {
  const dispatch = useDispatch();
  const { finalImage, gridImage, bias, rowCount, colCount } = useSelector((state) => state.imageProcessing);

  const performGridDetection = (image, bias) => {
    detectAndOverlayGrid(image, bias).then((grid) => {
      dispatch(setGridImage(grid.imageWithGrid));
      dispatch(setRowCount(grid.rowCount));
      dispatch(setColCount(grid.columnCount));
    });
  };

  useEffect(() => {
    if (finalImage) {
      performGridDetection(finalImage, bias);
    }
  }, [finalImage, bias]);

  const handleGridConfirm = () => {
    extractGridStructure(finalImage, rowCount, colCount, bias).then((cells) => {
      dispatch(setExtractedCells(cells));
      dispatch(setStage('classify'));
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = gridImage;
    link.download = 'grid.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="manual-stage">
      <img
        src={gridImage || finalImage}
        alt="Grid"
        style={{ maxWidth: "100%" }}
      />
      <div className="grid-controls">
        <label>Bias: {bias.toFixed(2)}</label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={bias}
          onChange={(e) => dispatch(setBias(parseFloat(e.target.value)))}
        />
         <label>Rows: {rowCount}</label>
        <input
          type="number"
          value={rowCount}
          onChange={(e) => dispatch(setRowCount(parseInt(e.target.value)))}
        />
        <label>Cols: {colCount}</label>
        <input
          type="number"
          value={colCount}
          onChange={(e) => dispatch(setColCount(parseInt(e.target.value)))}
        />
        <button onClick={handleGridConfirm}>AI Classify</button>
        <button onClick={handleDownload}>Download Image</button>
      </div>
    </div>
  );
};

export default GridDimensionDetector;
