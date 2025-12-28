import React from 'react';
import { InteractiveCanvas } from '../../common/InteractiveCanvas';

const Trimming = ({ 
  canvasRef, 
  imgRef, 
  imageSrc, 
  points, 
  onCanvasClick, 
  onMouseMove, 
  onMouseLeave, 
  magnifierRef,
  handleTrimConfirm 
}) => {
  return (
    <div className="manual-stage">
      <div className="interactive-canvas-container">
        <InteractiveCanvas
          ref={canvasRef}
          imgRef={imgRef}
          imageSrc={imageSrc}
          points={points}
          stage="trimming"
          onCanvasClick={onCanvasClick}
          onImageLoaded={() => {}}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        />
        <div ref={magnifierRef} className="magnifier"></div>
      </div>
      <p>
        Points selected: {points.length} / 4 (Top, Right, Bottom,
        Left)
      </p>
      <div className="manual-stage-controls">
        <button
          onClick={handleTrimConfirm}
          disabled={points.length !== 4}
        >
          {"Trim Image"}
        </button>
        <button onClick={() => { /* handleRevert */ }}>Revert</button>
      </div>
    </div>
  );
};

export default Trimming;
