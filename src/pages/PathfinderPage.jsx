import Grid from "../components/pathfinder/Grid";
import Controls from "../components/layout/Controls";

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
