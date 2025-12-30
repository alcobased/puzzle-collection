import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { InteractiveCanvas } from "../InteractiveCanvas";
import {
  setSizeMultiplier,
  setStage,
  setFinalImage,
  clearPerspectivePoints,
} from "../../../features/imageProcessing/imageProcessingSlice";
import { warpPerspective } from "../../../features/imageProcessing/imageProcessing";

const PerspectiveCorrection = () => {
  const dispatch = useDispatch();
  const { imageSrc, perspectivePoints, sizeMultiplier } = useSelector(
    (state) => state.imageProcessing
  );

  const handlePerspectiveConfirm = () => {
    warpPerspective(imageSrc, perspectivePoints, sizeMultiplier).then(
      (result) => {
        dispatch(setFinalImage(result.image));
        dispatch(setStage("trim"));
      }
    );
  };

  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas />
      </div>
      <p>Points selected: {perspectivePoints.length} / 4</p>
      <div className="perspective-controls">
        <label htmlFor="size-multiplier">Canvas Size Multiplier:</label>
        <input
          type="number"
          id="size-multiplier"
          value={sizeMultiplier}
          onChange={(e) =>
            dispatch(setSizeMultiplier(parseFloat(e.target.value)))
          }
          min="1"
          step="0.1"
        />
      </div>
      <div className="manual-stage-controls">
        <button
          onClick={handlePerspectiveConfirm}
          disabled={perspectivePoints.length !== 4}
        >
          {"Fix Perspective"}
        </button>
        <button
          onClick={() => {
            dispatch(clearPerspectivePoints());
          }}
        >
          Revert
        </button>
      </div>
    </div>
  );
};

export default PerspectiveCorrection;
