import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import PuzzleImage from "../../common/PuzzleImage";
import Lines from "./Lines";
import PathfinderWorkspace from "./PathfinderWorkspace";
import ControlPanel from "../../common/Controls/ControlPanel";
import ControlsStatus from "../../common/Controls/ControlsStatus.jsx";
import ControlsCells from "./ControlsCells.jsx";
import ControlsWords from "../../common/Controls/ControlsWords.jsx";
import ControlsImage from "../../common/Controls/ControlsImage.jsx";
import ControlsStorage from "../../common/Controls/ControlsStorage.jsx";
import ControlsSolver from "./ControlsSolver.jsx";

const PathfinderPage = () => {
  return (
    <>
      <PuzzleBoard>
        <PuzzleImage />
        <Lines />
        <PathfinderWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <ControlsStatus />
        <ControlsImage />
        <ControlsStorage />
        <ControlsSolver />
        <ControlsCells />
        <ControlsWords />
      </ControlPanel>
    </>
  );
};

export default PathfinderPage;
