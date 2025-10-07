import ControlsStatus from "../../common/ui/ControlsStatus.jsx"
import ControlsCells from "./ControlsCells.jsx"
import ControlsWords from "../words/ControlsWords.jsx"
import ControlsImage from "../../common/image/ControlsImage.jsx"
import ControlsStorage from "../../common/ui/ControlsStorage.jsx"
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