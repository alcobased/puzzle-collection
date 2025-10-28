import Controls from "../../common/Controls/Controls";
import PathfinderControls from "./ControlsPathfinder";
import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";

import PuzzleImage from "../../common/PuzzleImage";
import Lines from "./Lines";
import PathfinderCells from "./PathfinderCells";

const PathfinderPage = () => {
  return (
    <>
      <PuzzleBoard>
        <PuzzleImage />
        {/* <Lines /> */}
      <PathfinderCells />
      </PuzzleBoard>
      <Controls>
        <PathfinderControls />
      </Controls>
    </>
  );
};

export default PathfinderPage;
