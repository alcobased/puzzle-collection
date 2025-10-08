import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import GridCells from "./GridCells";
import GridLines from "./GridLines";
import Controls from "../../common/Controls/Controls";
import PathfinderControls from "./ControlsPathfinder";

const PathfinderPage = () => {
  return (
    <>
      <div className="grid-container">
        <PuzzleViewport>
          <GridCells />
          <GridLines />
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
