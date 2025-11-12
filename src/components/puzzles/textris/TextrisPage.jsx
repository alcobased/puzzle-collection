import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import TextrisWorkspace from "./TextrisWorkspace";
import ControlPanel from "../../common/Controls/ControlPanel";
import BoardGridControls from "./BoardGridControls";
import ShapesGridControls from "./ShapesGridControls";
import ShapeControls from "./ShapeControls";

const TextrisPage = () => {
  return (
    <>
      <PuzzleBoard>
        <TextrisWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <BoardGridControls />
        <ShapesGridControls />
        <ShapeControls />
      </ControlPanel>
    </>
  );
};

export default TextrisPage;
