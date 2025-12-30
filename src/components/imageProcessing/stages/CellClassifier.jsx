import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InteractiveCanvas } from '../InteractiveCanvas';
import {
  resetImageProcessingState,
} from '../../../features/imageProcessing/imageProcessingSlice';

const CellClassifier = () => {
  const dispatch = useDispatch();
  const { extractedCells } = useSelector((state) => state.imageProcessing);

  const handleFinish = () => {
    // Filter the cells that are active
    const activeCells = Object.values(extractedCells).filter((c) => c.active);
    console.log("Finished classification:", activeCells);
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
      <button onClick={handleFinish}>Finish</button>
      <button onClick={handleDownload}>Download JSON</button>
    </div>
  );
};

export default CellClassifier;
