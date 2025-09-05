import ControlsCells from "./ControlsCells";
import ControlsWords from "./ControlsWords";
import ControlsImage from "./ControlsImage";
import ControlsStorage from "./ControlsStorage";
import ControlsStatus from "./ControlsStatus";

const ControlPanel = () => {
  return (
    <div id="controlPanel">
      <ControlsStatus />
      <ControlsCells />
      <ControlsWords />
      <ControlsImage />
      <ControlsStorage />
    </div>
  );
};

export default ControlPanel;
