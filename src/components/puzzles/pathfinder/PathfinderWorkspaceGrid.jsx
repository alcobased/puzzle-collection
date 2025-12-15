import { useSelector } from "react-redux";
import Cell from "./Cell.jsx";

const PathfinderWorkspaceGrid = () => {
  const { width, height } = useSelector(
    (state) => state.puzzles.pathfinder.grid
  );
  const { cellStyle } = useSelector((state) => state.puzzles.pathfinder.cells);
  const cellSize = Math.min(cellStyle.width, cellStyle.height);

  const cells = [];
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      cells.push(
        <Cell
          x={x}
          y={y}
          key={`${x}-${y}`}
          style={cellStyle}
          className={"grid-cell"}
        />
      );
    }
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
    gap: "1px",
  };

  return <div style={gridStyle}>{cells}</div>;
};

export default PathfinderWorkspaceGrid;
