import React from 'react';

const CellClassifier = ({ 
  finalImage, 
  rowCount, 
  colCount, 
  extractedCells, 
  setExtractedCells, 
  handleFinish, 
  handleDownload 
}) => {
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
      <button onClick={handleFinish}>Finish</button>
      <button onClick={handleDownload}>Download Image</button>
    </div>
  );
};

export default CellClassifier;
