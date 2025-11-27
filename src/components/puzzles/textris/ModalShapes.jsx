import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  findValidShapeLocationOnBoard,
  addShape,
  updateShapeLocation,
} from "../../../features/textris/textrisSlice";
import { setNotification, hideModal } from "../../../features/ui/uiSlice";
import "./ModalShapes.css";

// Helper to create a clean 5x5 grid
const createEmptyGrid = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));

const ModalTextrisShapes = () => {
  const dispatch = useDispatch();

  const [grid, setGrid] = useState(createEmptyGrid());
  const board = useSelector((state) => state.puzzles.textris.shapesBoard);

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newGrid = grid.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) =>
            cIdx === colIndex ? e.target.value.toUpperCase() : cell
          )
        : row
    );
    setGrid(newGrid);
  };

  const parseAndAddShape = () => {
    let minRow = -1,
      maxRow = -1,
      minCol = -1,
      maxCol = -1;

    grid.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell) {
          if (minRow === -1) minRow = rIdx;
          maxRow = rIdx;
          if (minCol === -1 || cIdx < minCol) minCol = cIdx;
          if (maxCol === -1 || cIdx > maxCol) maxCol = cIdx;
        }
      });
    });

    if (minRow !== -1) {
      const shapeGrid = grid
        .slice(minRow, maxRow + 1)
        .map((row) => row.slice(minCol, maxCol + 1).map((c) => c || null));

      const newShape = {
        id: `shape-${Date.now()}`,
        grid: shapeGrid,
        color: Math.floor(Math.random() * 8) + 1, // random int in range 1-8
      };

      const validLocation = findValidShapeLocationOnBoard(board, newShape);

      console.log("valid location", validLocation);

      if (validLocation === null) {
        dispatch(
          setNotification({
            message: "Shape does not fit on the board",
            type: "error",
          })
        );
      } else {
        dispatch(addShape(newShape));
        dispatch(
          updateShapeLocation({
            shapeId: newShape.id,
            newBoardName: "shapesBoard",
            newLocationOnBoard: validLocation,
          })
        );
        setGrid(createEmptyGrid());
        dispatch(
          setNotification({
            message: "Shape added successfully!",
            type: "success",
          })
        );
        dispatch(hideModal());
      }
    }
  };

  return (
    <>
      <div className="modal-section">
        <h3>Create new shape</h3>
        <div id="shape-grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className="shape-grid-cell"
                type="text"
                maxLength="1"
                value={cell ? cell : ""}
                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
              />
            ))
          )}
        </div>
        <button className="modal-button" onClick={parseAndAddShape}>
          Add Shape
        </button>
      </div>
    </>
  );
};

export default ModalTextrisShapes;
