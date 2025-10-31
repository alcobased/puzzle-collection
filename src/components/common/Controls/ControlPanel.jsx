import { useSelector, useDispatch } from 'react-redux';
import { toggleControls } from '../../../features/ui/uiSlice';
import './ControlPanel.css';

const ControlPanel = (props) => {
  const isVisible = useSelector((state) => state.ui.isControlsVisible);
  const dispatch = useDispatch();

  const onToggleControls = () => {
    dispatch(toggleControls());
  };

  return (
    <div id="controlPanel" className={`controls-container ${!isVisible ? 'collapsed' : ''}`}>
      <button 
        className="toggle-visibility-btn"
        onClick={onToggleControls}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
      <div className="controls-content">
        {props.children}
      </div>
    </div>
  );
};

export default ControlPanel;
