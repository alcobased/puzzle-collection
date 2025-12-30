import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setExtractedCells, resetImageProcessingState } from '../../../features/imageProcessing/imageProcessingSlice';

const CellClassifier = () => {
  const dispatch = useDispatch();
  const { finalImage, rowCount, colCount, extractedCells } = useSelector((state) => state.imageProcessing);

  const handleCellClick = (clickedCell) => {
    const newCells = extractedCells.map((cell) =>
      cell.row === clickedCell.row && cell.col === clickedCell.col
        ? { ...cell, active: !cell.active }
        : cell
    );
    dispatch(setExtractedCells(newCells));
  };

  const handleFinish = () => {
    // Here you would typically save the data or move to another part of the app
    console.log('Finished classification:', extractedCells.filter(c => c.active));
    dispatch(resetImageProcessingState());

  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(extractedCells, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'cell_data.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              onClick={() => handleCellClick(cell)}
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
      <button onClick={handleDownload}>Download JSON</button>
    </div>
  );
};

export default CellClassifier;
