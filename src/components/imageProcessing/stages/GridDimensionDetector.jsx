import React from 'react';

const GridDimensionDetector = ({ 
  gridImage, 
  finalImage, 
  bias, 
  setBias, 
  performGridDetection, 
  handleGridConfirm, 
  handleDownload 
}) => {
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
        <button onClick={handleDownload}>Download Image</button>
      </div>
    </div>
  );
};

export default GridDimensionDetector;
