import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import Controls from "../../common/Controls/Controls";
import DominoControls from "./DominoControls";
import DominoBoard from "./DominoBoard";

const DominoPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <DominoBoard />
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
