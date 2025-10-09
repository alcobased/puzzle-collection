import ControlsStatus from "../../common/Controls/ControlsStatus";
import ControlsWords from "../../common/Controls/ControlsWords";
import ControlsImage from "../../common/Controls/ControlsImage";
import ControlsStorage from "../../common/Controls/ControlsStorage";

// Common controls only for now
// Domino specific controls will be added later
const DominoControls = () => {
    return (
    <div className="controls-content">
      <ControlsStatus />
      <ControlsImage />
      <ControlsStorage />
      <ControlsWords />
    </div>
  );
};

export default DominoControls;