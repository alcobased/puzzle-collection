// PathfinderWorkspaceImage.jsx - Refactored to define Cell's functionality
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Cell from "./Cell.jsx";
import {
  addCell,
  enqueue,
  popAndPurge,
  addQueue,
} from "../../../features/pathfinder/pathfinderSlice.js";
import { showModal } from "../../../features/ui/uiSlice"; // Added necessary action

const PathfinderWorkspaceImage = () => {
  const dispatch = useDispatch();

  const { cellSet, cellStyle, activeCell, queueSet, activeQueue } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );

  const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = useSelector(
    (state) => state.image.rendered
  );

  if (Object.keys(queueSet).length === 0) {
    dispatch(addQueue({ id: uuidv4() }));
  }

  const handleClick = (e) => {
    // Only add a cell if the click is on the container itself, not on a child cell.
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = x / offsetWidth;
    const normalizedY = y / offsetHeight;

    const newCellId = uuidv4();
    dispatch(addCell({ id: newCellId, x: normalizedX, y: normalizedY }));
    dispatch(enqueue(newCellId));
  };

  // --- NEW: Define the specific click functionality for a Cell ---
  const handleCellClick = (cellId) => (e) => {
    e.stopPropagation(); // Prevent the grid from creating a new cell
    dispatch(showModal({ type: "CELL_PROPERTIES", props: { cellId } }));
  };

  // --- NEW: Define the specific context menu functionality for a Cell ---
  const handleCellContextMenu = (cellId) => (e) => {
    e.preventDefault(); // Prevent the default context menu
    e.stopPropagation();

    const queue = queueSet[activeQueue];
    const lastInQueue = queue ? queue[queue.length - 1] : undefined;

    if (lastInQueue === cellId) {
      dispatch(popAndPurge());
    } else {
      dispatch(enqueue(cellId));
    }
  };

  const boardWorkspaceStyle = {
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`,
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
  };

  const activeQueueCells = activeQueue ? queueSet[activeQueue] || [] : [];

  return (
    <div onClick={handleClick} id="board-workspace" style={boardWorkspaceStyle}>
      {Object.values(cellSet).map((cell) => {
        const individualCellStyle = {
          width: cellStyle.width,
          height: cellStyle.height,
          fontSize: `${cellStyle.fontSize}px`,
          position: "absolute",
          left: cell.normalizedPosition.x * offsetWidth - cellStyle.width / 2,
          top: cell.normalizedPosition.y * offsetHeight - cellStyle.height / 2,
        };

        const isActive = cell.id === activeCell;
        const inActiveQueue = activeQueueCells.includes(cell.id);
        const additionalClassList = [
          "cell-image",
          isActive ? "active" : "",
          inActiveQueue ? "in-active-queue" : "",
        ];

        return (
          <Cell
            key={cell.id}
            id={cell.id}
            style={individualCellStyle}
            char={cell.char}
            additionalClassList={additionalClassList}
            solutionChar={cell.solutionChar}
            // Pass the generated handlers as props
            onClick={handleCellClick(cell.id)}
            onContextMenu={handleCellContextMenu(cell.id)}
          />
        );
      })}
    </div>
  );
};

export default PathfinderWorkspaceImage;
