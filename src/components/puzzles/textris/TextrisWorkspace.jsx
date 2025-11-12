import React from "react";
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

  const projectShapesToGrid = (grid, shapes, gridName) => {
    const { height, width } = grid;
    const newGrid = createVisualGrid(height, width);

    shapes.forEach((shape) => {
      // only unselected shapes should be projected here
      if (shape.selected) return;

      const { grid, position, color, id, highlighted } = shape;
      grid.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char) {
            const boardX = position.x + x;
            const boardY = position.y + y;
            if (boardY < newGrid.length && boardX < newGrid[0].length) {
              newGrid[boardY][boardX] = {
                char,
                cellColor: `color-${color}`,
                shapeId: id,
                relativePosition: { x, y },
              };
            }
          }
        });
      });
    });

    // selected shape should be projected here, possibly overriding some of the cells
    // if (selectedShape.id && selectedShape.gridName === gridName) {
    //   const { relativePosition, absolutePosition } = selectedShape;
    //   const shape = shapesCollection.find((s) => s.id === selectedShape.id);
    //   if (shape) {
    //     const { grid, color, id, highlighted } = shape;
    //     grid.forEach((row, y) => {
    //       row.forEach((char, x) => {
    //         if (char) {
    //           const boardX = absolutePosition.x + x - relativePosition.x;
    //           const boardY = absolutePosition.y + y - relativePosition.y;
    //           if (boardY < newGrid.length && boardX < newGrid[0].length) {
    //             newGrid[boardY][boardX] = {
    //               char,
    //               cellColor: `color-${color}`,
    //               shapeId: id,
    //               highlighted,
    //             };
    //           }
    //         }
    //       });
    //     });
    //   }
    // }
    return newGrid;
  };

  const visualBoardGrid = projectShapesToGrid(
    boardGrid,
    shapesOnBoardGrid,
    "boardGrid"
  );
  const visualShapesGrid = projectShapesToGrid(
    shapesGrid,
    shapesOnShapesGrid,
    "shapesGrid"
  );

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
