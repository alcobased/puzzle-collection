import Grid from "../puzzles/pathfinder/Grid";
import Controls from "../common/layout/Controls";

const PathfinderPage = () => {
  return (
    <>
      <div className="grid-container">
        <Grid />
      </div>
      <div className="controls-container">
        <Controls />
      </div>
    </>
  );
};

export default PathfinderPage;
