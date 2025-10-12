import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import PathfinderBoard from "./PathfinderBoard";
import Lines from "./Lines";
import Controls from "../../common/Controls/Controls";
import PathfinderControls from "./ControlsPathfinder";

const PathfinderPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <PathfinderBoard />
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
