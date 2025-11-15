import { useSelector } from "react-redux";
import Cell from "./Cell";
import "./TextrisWorkspace.css";

const TextrisWorkspace = () => {
  const {
    solutionBoard,
    shapesBoard,
    shapesCollection,
    liftedShape,
    highlightedShapeId,
    cursor,
  } = useSelector((state) => state.puzzles.textris);

  const cellSize = 20;
  const shapesOnSolutionBoard = shapesCollection.filter(
    (s) => s.boardName === "solutionBoard"
  );
  const shapesOnShapesBoard = shapesCollection.filter(
    (s) => s.boardName === "shapesBoard"
  );

  const createVisualGrid = (height, width) => {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ char: null }))
    );
  };

  const projectShapesToBoard = (board, shapes) => {
    const { height, width } = board;
    const newGrid = createVisualGrid(height, width);

    shapes.forEach((shape) => {
      // only unlifted shapes should be projected here
      if (liftedShape && shape.id === liftedShape.id) return;

      const { grid, locationOnBoard, color, id } = shape;

      grid.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char) {
            const boardX = locationOnBoard.x + x;
            const boardY = locationOnBoard.y + y;
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

    if (liftedShape && cursor && cursor.boardName === board.name) {
      liftedShape.grid.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char) {
            const boardX = cursor.locationOnBoard.x + x - liftedShape.offset.x;
            const boardY = cursor.locationOnBoard.y + y - liftedShape.offset.y;
            if (
              boardY < newGrid.length &&
              boardX < newGrid[0].length &&
              boardY >= 0 &&
              boardX >= 0
            ) {
              newGrid[boardY][boardX] = {
                shapeId: liftedShape.id,
                char,
                shapeOffset: { x, y },
                cellColor: `color-${liftedShape.color}`,
                cursor,
                liftedShape,
              };
            }
          }
        });
      });
    }

    return newGrid;
  };

  const visualSolutionBoard = projectShapesToBoard(
    solutionBoard,
    shapesOnSolutionBoard
  );
  const visualShapesBoard = projectShapesToBoard(
    shapesBoard,
    shapesOnShapesBoard
  );

  const renderBoard = (boardGrid, boardName) => {
    if (!boardGrid || !boardGrid.length) return null;
    const rows = boardGrid.length;
    const cols = boardGrid[0].length;
    const style = {
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    };
    return (
      <div style={style} className="grid-board">
        {boardGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${boardName}-${rowIndex}-${colIndex}`}
              {...cell}
              absolutePosition={{ x: colIndex, y: rowIndex }}
              boardGrid={boardGrid}
              boardName={boardName}
              highlighted={highlightedShapeId === cell.shapeId}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div id="board-workspace">
      <div id="board-container">
        <h2>Solution board</h2>
        {renderBoard(visualSolutionBoard, "solutionBoard")}
      </div>
      <div id="shapes-container">
        <h2>Shapes board</h2>
        {renderBoard(visualShapesBoard, "shapesBoard")}
      </div>
    </div>
  );
};

export default TextrisWorkspace;
