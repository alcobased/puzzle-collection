import ControlsStatus from "../../common/Controls/ControlsStatus";
import ControlsWords from "../../common/Controls/ControlsWords";
import ControlsImage from "../../common/Controls/ControlsImage";
import ControlsStorage from "../../common/Controls/ControlsStorage";
import GroupControls from "./GroupControls";
import GridControls from "./GridControls";

// Common controls only for now
// Domino specific controls will be added later
const DominoControls = () => {
    return (
    <div className="controls-content">
      <ControlsStatus />
      <ControlsImage />
      <ControlsStorage />
      <ControlsWords />
      <GroupControls />
      <GridControls />
    </div>
  );
};

export default DominoControls;