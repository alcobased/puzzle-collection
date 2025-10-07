import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import GridCell from "./GridCell";
import { addCell, enqueue } from "../../../features/pathfinder/pathfinderSlice.js";

const GridCells = () => {
  const { cellSet, cellStyle, activeCell, queueSet, activeQueue } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );
  const { width, height, top, left } = useSelector(
    (state) => state.image.rendered
  );
  const dispatch = useDispatch();

  const handleClick = (e) => {
    // Only add a cell if the click is on the container itself, not on a child cell.
    if (e.target !== e.currentTarget) {
      return;
    }

    if (width === 0 || height === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = x / width;
    const normalizedY = y / height;

    const newCellId = uuidv4();
    dispatch(addCell({ id: newCellId, x: normalizedX, y: normalizedY }));
    dispatch(enqueue(newCellId));
  };

  const activeQueueCells = activeQueue ? queueSet[activeQueue] || [] : [];

  return (
    <div
      id="cells"
      onClick={handleClick}
      style={{
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {Object.values(cellSet).map((cell) => {
        const individualCellStyle = {
          width: cellStyle.width,
          height: cellStyle.height,
          fontSize: `${cellStyle.fontSize}px`,
          position: "absolute",
          left: cell.normalizedPosition.x * width - cellStyle.width / 2,
          top: cell.normalizedPosition.y * height - cellStyle.height / 2,
        };

        const isActive = cell.id === activeCell;
        const inActiveQueue = activeQueueCells.includes(cell.id);
        const className = `grid-cell ${isActive ? "active" : ""} ${
          inActiveQueue ? "in-active-queue" : ""
        }`;

        return (
          <GridCell
            key={cell.id}
            id={cell.id}
            style={individualCellStyle}
            char={cell.char}
            className={className}
            solutionChar={cell.solutionChar}
          />
        );
      })}
    </div>
  );
};

export default GridCells;