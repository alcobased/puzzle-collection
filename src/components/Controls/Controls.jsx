import { useState } from 'react';
import ControlsCells from "./ControlsCells";
import ControlsWords from "./ControlsWords";
import ControlsImage from "./ControlsImage";
import ControlsStorage from "./ControlsStorage";
import ControlsStatus from "./ControlsStatus";
import ControlsSolver from "./ControlsSolver";
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
