import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import PathfinderBoard from "./PathfinderBoard";
import Lines from "./Lines";
import Controls from "../../common/Controls/Controls";
import PathfinderControls from "./ControlsPathfinder";
import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";

const PathfinderPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <PuzzleBoard>
            <PathfinderBoard />
            <Lines />
          </PuzzleBoard>
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
