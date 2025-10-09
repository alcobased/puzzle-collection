import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import Cells from "./Cells";
import Lines from "./Lines";
import Controls from "../../common/Controls/Controls";
import PathfinderControls from "./ControlsPathfinder";

const PathfinderPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <Cells />
          <Lines />
        </PuzzleViewport>
      </div>
      <div className="controls-container">
        <Controls>
          <PathfinderControls />
        </Controls>
      </div>
    </>
  );
};

export default PathfinderPage;
