import ControlsStatus from "../../common/Controls/ControlsStatus.jsx";
import ControlsCells from "./ControlsCells.jsx";
import ControlsWords from "../../common/Controls/ControlsWords.jsx";
import ControlsImage from "../../common/Controls/ControlsImage.jsx";
import ControlsStorage from "../../common/Controls/ControlsStorage.jsx";
import ControlsSolver from "./ControlsSolver.jsx";

const PathfinderControls = () => {
  return (
    <div className="controls-content">
      <ControlsStatus />
      <ControlsImage />
      <ControlsStorage />
      <ControlsSolver />
      <ControlsCells />
      <ControlsWords />
    </div>
  );
};

export default PathfinderControls;
