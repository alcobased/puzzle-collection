import { useState } from 'react';
import './Controls.css';
import PathfinderControls from '../../puzzles/pathfinder/PathfinderControls';

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
      <PathfinderControls/>
    </div>
  );
};

export default ControlPanel;
