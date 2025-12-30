import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStage } from '../../features/imageProcessing/imageProcessingSlice';

const ImageProcessingStageSelector = () => {
  const dispatch = useDispatch();
  const currentStage = useSelector((state) => state.imageProcessing.stage);

  const stages = [
    { id: 'load', label: 'Load Image' },
    { id: 'perspective', label: 'Perspective Correction' },
    { id: 'trim', label: 'Trimming' },
    { id: 'grid', label: 'Grid Detection' },
    { id: 'classify', label: 'Classification' },
  ];

  const handleStageSelect = (stage) => {
    dispatch(setStage(stage));
  };

  return (
    <div className="stage-selector">
      {stages.map((stage) => (
        <button
          key={stage.id}
          className={`stage-button ${currentStage === stage.id ? 'active' : ''}`}
          onClick={() => handleStageSelect(stage.id)}
        >
          {stage.label}
        </button>
      ))}
    </div>
  );
};

export default ImageProcessingStageSelector;
