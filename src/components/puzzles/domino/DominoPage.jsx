import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import Controls from "../../common/Controls/Controls";
import DominoControls from "./DominoControls";
import DominoBoard from "./DominoBoard";
import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";

const DominoPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <PuzzleBoard>
            <DominoBoard />
          </PuzzleBoard>
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
