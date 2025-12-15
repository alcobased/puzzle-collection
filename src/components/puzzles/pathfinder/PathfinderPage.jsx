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
import ControlsBoardMode from "./ControlsBoardMode.jsx";
import { useSelector } from "react-redux";

const PathfinderPage = () => {
  const boardMode = useSelector((state) => state.puzzles.pathfinder.boardMode);

  return (
    <>
      <PuzzleBoard>
        {boardMode === "image" && (
          <>
            <PuzzleImage />
            <Lines />
            <PathfinderWorkspaceImage />
          </>
        )}
        {boardMode === "grid" && (
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
        <ControlsBoardMode />
        <ControlsSolver />
        <ControlsCells />
        <ControlsWords />
      </ControlPanel>
    </>
  );
};

export default PathfinderPage;
