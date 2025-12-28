import React from 'react';
import { InteractiveCanvas } from '../../common/InteractiveCanvas';

const PerspectiveCorrection = ({ 
  canvasRef, 
  imgRef, 
  imageSrc, 
  points, 
  onCanvasClick, 
  onMouseMove, 
  onMouseLeave, 
  magnifierRef,
  sizeMultiplier,
  setSizeMultiplier,
  handlePerspectiveConfirm 
}) => {
  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas
          ref={canvasRef}
          imgRef={imgRef}
          imageSrc={imageSrc}
          points={points}
          stage="perspective"
          onCanvasClick={onCanvasClick}
          onImageLoaded={() => {}}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
        <div ref={magnifierRef} className="magnifier"></div>
      </div>
      <p>Points selected: {points.length} / 4</p>
      <div className="perspective-controls">
        <label htmlFor="size-multiplier">Canvas Size Multiplier:</label>
        <input
          type="number"
          id="size-multiplier"
          value={sizeMultiplier}
          onChange={(e) => setSizeMultiplier(parseFloat(e.target.value))}
          min="1"
          step="0.1"
        />
      </div>
      <div className="manual-stage-controls">
        <button
          onClick={handlePerspectiveConfirm}
          disabled={points.length !== 4}
        >
          {"Fix Perspective"}
        </button>
        <button onClick={() => { /* handleRevert */ }}>Revert</button>
      </div>
    </div>
  );
};

export default PerspectiveCorrection;
