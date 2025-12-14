import { useSelector } from "react-redux";
import Cell from "./Cell";

const PathfinderWorkspaceGrid = () => {
  const { width, height } = useSelector(
    (state) => state.puzzles.pathfinder.grid
  );
  const { cellStyle, cellSet } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );
  const cellSize = Math.min(cellStyle.width, cellStyle.height);

  const cells = [];
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      cells.push(<Cell x={x} y={y} key={`${x}-${y}`} style={cellStyle} />);
    }
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
  };

  return <div style={gridStyle}>{cells}</div>;
};

export default PathfinderWorkspaceGrid;
