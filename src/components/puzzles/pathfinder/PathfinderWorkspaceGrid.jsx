import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setSelectionStartCell,
  clearSelectionStartCell,
  setSelectionEndCell,
  clearSelectionEndCell,
  addSeletedCells,
  toggleMarkingStartCell,
  setQueueStartCell,
  clearQueueStartCell,
  setFlashingCurrentQueue,
  incrementFlashingCurrentCellIndex,
} from "../../../features/pathfinder/pathfinderSlice.js";
import { showModal } from "../../../features/ui/uiSlice.js";
import Cell from "./Cell.jsx";

const PathfinderWorkspaceGrid = () => {
  const { width, height } = useSelector(
    (state) => state.puzzles.pathfinder.grid
  );

  const {
    cellStyle,
    queueSet,
    selectionStartCell,
    selectionEndCell,
    cellSet,
    queueStartCell,
    markingStartCell,
    queueFlashing,
  } = useSelector((state) => state.puzzles.pathfinder.cells);

  const dispatch = useDispatch();

  useEffect(() => {
    if (queueFlashing && queueFlashing.currentQueue) {
      const timer = setTimeout(() => {
        dispatch(incrementFlashingCurrentCellIndex());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [queueFlashing, dispatch]);

  const cellSize = Math.min(cellStyle.width, cellStyle.height);

  const handleClick = (x, y) => {
    if (markingStartCell) {
      if (queueStartCell) {
        dispatch(clearQueueStartCell());
      } else {
        dispatch(setQueueStartCell({ x, y }));
      }
      dispatch(toggleMarkingStartCell());
      return;
    }
    if (selectionStartCell) {
      // if a cell is already selected, confirm the end of the selection
      dispatch(addSeletedCells({ c1: selectionStartCell, c2: { x, y } }));
      dispatch(clearSelectionStartCell());
      dispatch(clearSelectionEndCell());
    } else {
      // if no cell is already selected, set the start of the selection
      dispatch(setSelectionStartCell({ x, y }));
    }
  };

  const handleMouseOver = (x, y) => {
    // console.log(`Grid cell was hovered @ [x: ${x}, y: ${y}]`);
    if (selectionStartCell) {
      dispatch(setSelectionEndCell({ x, y }));
    }
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    dispatch(showModal({ type: "CELL_PROPERTIES", props: { cellId: id } }));
  };

  const isSelectedCell = (cell, startCell, endCell) => {
    // start and end cells must be initialized
    if (!startCell || !endCell) return false;
    // start and end cells must have at least on matching coordinate
    if (startCell.x !== endCell.x && startCell.y !== endCell.y) return false;
    // cell must be between the start and end cells
    const minX = Math.min(startCell.x, endCell.x);
    const maxX = Math.max(startCell.x, endCell.x);
    const minY = Math.min(startCell.y, endCell.y);
    const maxY = Math.max(startCell.y, endCell.y);
    console.log(minX, maxX, minY, maxY);

    return cell.x >= minX && cell.x <= maxX && cell.y >= minY && cell.y <= maxY;
  };

  const cells = [];
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      const key = `${x},${y}`;
      const char = cellSet[key] ? cellSet[key].char : null;
      const solutionChar = cellSet[key] ? cellSet[key].solutionChar : null;
      cells.push(
        <Cell
          x={x}
          y={y}
          key={key}
          char={char}
          solutionChar={solutionChar}
          style={cellStyle}
          additionalClassList={[
            "cell-grid",
            selectionStartCell &&
            x === selectionStartCell.x &&
            y === selectionStartCell.y
              ? "selected-start"
              : "",
            selectionEndCell &&
            x === selectionEndCell.x &&
            y === selectionEndCell.y
              ? "selected-end"
              : "",
            isSelectedCell({ x, y }, selectionStartCell, selectionEndCell)
              ? "selected"
              : "",
            cellSet[key] ? "marked" : "",
            queueStartCell && x === queueStartCell.x && y === queueStartCell.y
              ? "queue-start"
              : "",
            queueFlashing &&
            queueFlashing.currentQueue &&
            queueFlashing.currentCellIndex !== null &&
            queueSet[queueFlashing.currentQueue][
              queueFlashing.currentCellIndex
            ] === key
              ? "flashing"
              : "",
          ]}
          onClick={() => handleClick(x, y)}
          onMouseOver={() => handleMouseOver(x, y)}
          onContextMenu={(e) => handleContextMenu(e, key)}
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
