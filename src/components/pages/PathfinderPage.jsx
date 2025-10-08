import Grid from "../puzzles/pathfinder/Grid";
import Controls from "../common/Controls/Controls";
import PathfinderControls from "../puzzles/pathfinder/ControlsPathfinder";

const PathfinderPage = () => {
  return (
    <>
      <div className="grid-container">
        <Grid />
      </div>
      <div className="controls-container">
        <Controls>
          <PathfinderControls />
        </Controls>
      </div>
    </>
  );
};

export default PathfinderPage;
