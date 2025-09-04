import ControlsCells from "./ControlsCells";
import ControlsWords from "./ControlsWords";
import ControlsImage from "./ControlsImage";
import ControlsStorage from "./ControlsStorage";

const ControlPanel = () => {
  return (
    <div id="controlPanel">
      <ControlsCells />
      <ControlsWords />
      <ControlsImage />
      <ControlsStorage />
    </div>
  );
};

export default ControlPanel;
