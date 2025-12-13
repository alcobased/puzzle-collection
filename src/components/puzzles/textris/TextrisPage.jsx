import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import TextrisWorkspace from "./TextrisWorkspace";
import ControlPanel from "../../common/Controls/ControlPanel";
import BoardControls from "./BoardControls";
import ShapeControls from "./ShapeControls";
import BoardMaskControls from "./BoardMaskControls";
import ControlsStorage from "../../common/Controls/ControlsStorage";

const TextrisPage = () => {
  return (
    <>
      <PuzzleBoard>
        <TextrisWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <BoardControls boardName="solutionBoard" />
        <BoardControls boardName="shapesBoard" />
        <ShapeControls />
        <BoardMaskControls />
        <ControlsStorage
          puzzleName={"textris"}
          saveWords={false}
          saveImage={false}
        />
      </ControlPanel>
    </>
  );
};

export default TextrisPage;
