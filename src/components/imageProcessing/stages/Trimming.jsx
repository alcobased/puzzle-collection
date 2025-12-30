import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { InteractiveCanvas } from "../InteractiveCanvas";
import {
  setStage,
  setFinalImage,
  clearTrimmingPoints,
} from "../../../features/imageProcessing/imageProcessingSlice";
import { trimImage } from "../../../features/imageProcessing/imageProcessing";

const Trimming = () => {
  const dispatch = useDispatch();
  const { finalImage, trimmingPoints } = useSelector(
    (state) => state.imageProcessing
  );

  const handleTrimConfirm = () => {
    trimImage(finalImage, trimmingPoints).then((trimmedImage) => {
      dispatch(setFinalImage(trimmedImage.image));
      dispatch(setStage("grid"));
    });
  };

  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas />
      </div>
      <p>
        Points selected: {trimmingPoints.length} / 4 (Top, Right, Bottom, Left)
      </p>
      <div className="manual-stage-controls">
        <button
          onClick={handleTrimConfirm}
          disabled={trimmingPoints.length !== 4}
        >
          {"Trim Image"}
        </button>
        <button
          onClick={() => {
            dispatch(clearTrimmingPoints());
          }}
        >
          Revert
        </button>
      </div>
    </div>
  );
};

export default Trimming;
