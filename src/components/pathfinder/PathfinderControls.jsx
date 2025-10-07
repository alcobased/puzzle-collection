import ControlsStatus from "../ui/ControlsStatus.jsx"
import ControlsCells from "./ControlsCells.jsx"
import ControlsWords from "../words/ControlsWords.jsx"
import ControlsImage from "../image/ControlsImage.jsx"
import ControlsStorage from "../ui/ControlsStorage.jsx"
import ControlsSolver from "./ControlsSolver.jsx"

const PathfinderControls = () => {
    return (
        <div className="controls-content">
        <ControlsStatus />
        <ControlsCells />
        <ControlsWords />
        <ControlsImage />
        <ControlsStorage />
        <ControlsSolver />
      </div>
    )
}

export default PathfinderControls;