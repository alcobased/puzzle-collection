import Grid from "../common/Grid/Grid";
import GridCells from "../puzzles/pathfinder/GridCells";
import GridLines from "../puzzles/pathfinder/GridLines";
import Controls from "../common/Controls/Controls";
import PathfinderControls from "../puzzles/pathfinder/ControlsPathfinder";

const PathfinderPage = () => {
  return (
    <>
      <div className="grid-container">
        <Grid>
          <GridCells />
          <GridLines />
        </Grid>
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
