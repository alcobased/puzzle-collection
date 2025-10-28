import Controls from "../../common/Controls/Controls";
import DominoControls from "./DominoControls";
import DominoBoard from "./DominoBoard";
import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";

const DominoPage = () => {
  return (
    <>
      <PuzzleBoard>
        <DominoBoard />
      </PuzzleBoard>
      <Controls>
        <DominoControls />
      </Controls>
    </>
  );
};

export default DominoPage;
