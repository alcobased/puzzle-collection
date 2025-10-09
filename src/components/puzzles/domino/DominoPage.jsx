import PuzzleViewport from "../../common/PuzzleViewport/PuzzleViewport";
import Controls from "../../common/Controls/Controls";
import ControlsDomino from "./ControlsDomino";
import Dominoes from "./Dominoes";

const DominoPage = () => {
  return (
    <>
      <div className="puzzle-container">
        <PuzzleViewport>
          <Dominoes />
        </PuzzleViewport>
      </div>
      <div className="controls-container">
        <Controls>
          <ControlsDomino />
        </Controls>
      </div>
    </>
  );
};

export default DominoPage;
