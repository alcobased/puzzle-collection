import ControlsCells from "./ControlsCells";
import ControlsWords from "./ControlsWords";
import ControlsImage from "./ControlsImage";
import ControlsStorage from "./ControlsStorage";
import ControlsStatus from "./ControlsStatus";
import ControlsSolver from "./ControlsSolver";
import './Controls.css';

const ControlPanel = () => {
  return (
    <div id="controlPanel">
      <ControlsStatus />
      <ControlsCells />
      <ControlsWords />
      <ControlsImage />
      <ControlsStorage />
      <ControlsSolver />
    </div>
  );
};

export default ControlPanel;
