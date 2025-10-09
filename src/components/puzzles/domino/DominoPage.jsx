import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import Controls from "../../common/Controls/Controls";
import DominoControls from "./DominoControls";
import DominoGrid from "./DominoGrid";

const DominoPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <DominoGrid />
        </PuzzleViewport>
      </div>
      <div className="controls-container">
        <Controls>
          <DominoControls />
        </Controls>
      </div>
    </>
  );
};

export default DominoPage;
