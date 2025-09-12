import { useState } from 'react';
import ControlsCells from "../pathfinder/ControlsCells";
import ControlsWords from "../words/ControlsWords";
import ControlsImage from "../image/ControlsImage";
import ControlsStorage from "../ui/ControlsStorage";
import ControlsStatus from "../ui/ControlsStatus";
import ControlsSolver from "../pathfinder/ControlsSolver";
import './Controls.css';

const ControlPanel = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div id="controlPanel" className={!isVisible ? 'collapsed' : ''}>
      <button 
        className="toggle-visibility-btn"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
      <div className="controls-content">
        <ControlsStatus />
        <ControlsCells />
        <ControlsWords />
        <ControlsImage />
        <ControlsStorage />
        <ControlsSolver />
      </div>
    </div>
  );
};

export default ControlPanel;
