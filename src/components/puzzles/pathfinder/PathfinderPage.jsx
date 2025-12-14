import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import PuzzleImage from "../../common/PuzzleImage";
import Lines from "./Lines";
import PathfinderWorkspaceImage from "./PathfinderWorkspaceImage";
import PathfinderWorkspaceGrid from "./PathfinderWorkspaceGrid";
import ControlPanel from "../../common/Controls/ControlPanel";
import ControlsStatus from "../../common/Controls/ControlsStatus";
import ControlsCells from "./ControlsCells.jsx";
import ControlsWords from "../../common/Controls/ControlsWords";
import ControlsImage from "../../common/Controls/ControlsImage";
import ControlsStorage from "../../common/Controls/ControlsStorage";
import ControlsSolver from "./ControlsSolver";
import { useSelector } from "react-redux";

const PathfinderPage = () => {
  const boardType = useSelector((state) => state.puzzles.pathfinder.boardType);

  return (
    <>
      <PuzzleBoard>
        {boardType === "image" && (
          <>
            <PuzzleImage />
            <Lines />
            <PathfinderWorkspaceImage />
          </>
        )}
        {boardType === "grid" && (
          <>
            <PathfinderWorkspaceGrid />
          </>
        )}
      </PuzzleBoard>
      <ControlPanel>
        <ControlsStatus />
        <ControlsImage />
        <ControlsStorage
          puzzleName={"pathfinder"}
          saveWords={true}
          saveImage={true}
        />
        <ControlsSolver />
        <ControlsCells />
        <ControlsWords />
      </ControlPanel>
    </>
  );
};

export default PathfinderPage;
