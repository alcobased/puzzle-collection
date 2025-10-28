import { useState } from 'react';
import './Controls.css';

const Controls = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div id="controlPanel" className={`controls-container ${!isVisible ? 'collapsed' : ''}`}>
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

export default Controls;
