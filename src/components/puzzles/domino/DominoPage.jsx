import PuzzleBoard from "../../common/PuzzleBoard/PuzzleBoard";
import PuzzleImage from "../../common/PuzzleImage";
import DominoWorkspace from "./DominoWorkspace";
import ControlPanel from "../../common/Controls/ControlPanel";
import ControlsStatus from "../../common/Controls/ControlsStatus";
import ControlsWords from "../../common/Controls/ControlsWords";
import ControlsImage from "../../common/Controls/ControlsImage";
import ControlsStorage from "../../common/Controls/ControlsStorage";
import GroupControls from "./GroupControls";
import GridControls from "./GridControls";

const DominoPage = () => {
  return (
    <>
      <PuzzleBoard>
        <PuzzleImage />
        <DominoWorkspace />
      </PuzzleBoard>
      <ControlPanel>
        <ControlsStatus />
        <ControlsImage />
        <ControlsStorage
          puzzleName={"domino"}
          saveImage={true}
          saveWords={true}
        />
        <ControlsWords />
        <GroupControls />
        <GridControls />
      </ControlPanel>
    </>
  );
};

export default DominoPage;
