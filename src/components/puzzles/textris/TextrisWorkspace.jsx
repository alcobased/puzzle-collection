import { useSelector } from "react-redux";
import Cell from "./Cell";
import "./TextrisWorkspace.css";

const TextrisWorkspace = () => {
  const {
    boardGrid,
    shapesGrid,
    shapesCollection,
    liftedShape,
    highlightedShapeId,
    cursorLocation,
  } = useSelector((state) => state.puzzles.textris);
  const cellSize = 20;
  const shapesOnBoardGrid = shapesCollection.filter(
    (s) => s.location === "boardGrid"
  );
  const shapesOnShapesGrid = shapesCollection.filter(
    (s) => s.location === "shapesGrid"
  );

  const createVisualGrid = (height, width) => {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ char: null }))
    );
  };

  const projectShapesToGrid = (boardGrid, shapes) => {
    const { height, width } = boardGrid;
    const newGrid = createVisualGrid(height, width);

    shapes.forEach((shape) => {
      // only unlifted shapes should be projected here
      if (liftedShape && shape.id === liftedShape.shape.id) return;

      const { grid, position, color, id } = shape;
      grid.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char) {
            const boardX = position.x + x;
            const boardY = position.y + y;
            if (boardY < newGrid.length && boardX < newGrid[0].length) {
              newGrid[boardY][boardX] = {
                shapeId: id,
                char,
                shapeOffset: { x, y },
                cellColor: `color-${color}`,
              };
            }
          }
        });
      });
    });

    // lifted shape should be projected here
    if (
      liftedShape &&
      cursorLocation &&
      cursorLocation.gridName === boardGrid.name
    ) {
      liftedShape.shape.grid.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char) {
            const boardX = cursorLocation.position.x + x - liftedShape.offset.x;
            const boardY = cursorLocation.position.y + y - liftedShape.offset.y;
            if (
              boardY < newGrid.length &&
              boardX < newGrid[0].length &&
              boardY >= 0 &&
              boardX >= 0
            ) {
              newGrid[boardY][boardX] = {
                shapeId: liftedShape.shape.id,
                char,
                shapeOffset: { x, y },
                cellColor: `color-${liftedShape.shape.color}`,
              };
            }
          }
        });
      });
    }

    return newGrid;
  };

  const visualBoardGrid = projectShapesToGrid(boardGrid, shapesOnBoardGrid);
  const visualShapesGrid = projectShapesToGrid(shapesGrid, shapesOnShapesGrid);

  const renderGrid = (grid, gridName) => {
    if (!grid || !grid.length) return null;
    const rows = grid.length;
    const cols = grid[0].length;
    const style = {
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    };
    return (
      <div style={style} className="grid-board">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${gridName}-${rowIndex}-${colIndex}`}
              {...cell}
              absolutePosition={{ x: colIndex, y: rowIndex }}
              liftedShape={liftedShape}
              gridName={gridName}
              highlighted={highlightedShapeId === cell.shapeId}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div id="board-workspace">
      <div id="shapes-container">
        <h2>Shapes</h2>
        {renderGrid(visualShapesGrid, "shapesGrid")}
      </div>
      <div id="board-container">
        <h2>Board</h2>
        {renderGrid(visualBoardGrid, "boardGrid")}
      </div>
    </div>
  );
};

export default TextrisWorkspace;
