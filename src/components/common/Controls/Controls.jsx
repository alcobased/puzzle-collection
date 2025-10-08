import { useState } from 'react';
import './Controls.css';
import PathfinderControls from '../../puzzles/pathfinder/ControlsPathfinder';

const ControlPanel = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div id="controlPanel" className={!isVisible ? 'collapsed' : ''}>
      <button 
        className="toggle-visibility-btn"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {props.children}
    </div>
  );
};

export default ControlPanel;
