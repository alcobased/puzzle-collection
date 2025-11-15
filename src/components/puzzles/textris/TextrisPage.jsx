import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import TextrisWorkspace from "./TextrisWorkspace";
import ControlPanel from "../../common/Controls/ControlPanel";
import BoardControls from "./BoardControls";

const TextrisPage = () => {
  return (
    <>
      <PuzzleBoard>
        <TextrisWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <BoardControls boardName="solutionBoard" />
        <BoardControls boardName="shapesBoard" />
        {/* <ShapeControls /> */}
      </ControlPanel>
    </>
  );
};

export default TextrisPage;
