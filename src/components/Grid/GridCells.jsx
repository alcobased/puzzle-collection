import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Cell from "./GridCell";
import { addCell, enqueue } from "../../reducers/cellReducer";

const GridCells = () => {
  const { cellSet, cellStyle, activeCell } = useSelector(
    (state) => state.cells
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

  return (
    <div
      id="cells"
      onClick={handleClick}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {cellSet.map((cell) => {
        const individualCellStyle = {
          ...cellStyle,
          left: cell.normalizedPosition.x * width - cellStyle.width / 2,
          top: cell.normalizedPosition.y * height - cellStyle.height / 2,
        };

        // Apply a different style if the cell is active
        if (cell.id === activeCell) {
          individualCellStyle.border = "2px solid blue";
          individualCellStyle.zIndex = 1; // Ensure active cell is on top
        }

        return (
          <Cell
            key={cell.id}
            id={cell.id}
            style={individualCellStyle}
            char={cell.char}
          />
        );
      })}
    </div>
  );
};

export default GridCells;
