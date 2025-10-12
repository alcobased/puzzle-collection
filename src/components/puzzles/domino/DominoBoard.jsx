import { useSelector, useDispatch } from 'react-redux';
import GridCell from './GridCell';
import {
  startSelection,
  updateSelection,
  endSelection,
  toggleStartCell,
} from '../../../features/domino/dominoSlice';

const DominoBoard = ({ rendered }) => {
  const dispatch = useDispatch();
  const { grid } = useSelector((state) => state.puzzles.domino);

  if (!rendered || !grid) {
    return null;
  }

  const { data, width, height, occupiedCells, groups } = grid;
  const { groupList, selection } = groups;

  const cellSize = Math.min(rendered.width / width, rendered.height / height);

  const getCellCoords = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    return { x: cellX, y: cellY };
  };

  const handleMouseDown = (e) => {
    const coords = getCellCoords(e);
    // Only start selection if the cell is not occupied
    if (!occupiedCells[coords.y][coords.x]) {
      dispatch(startSelection(coords));
    }
  };

  const handleMouseMove = (e) => {
    if (selection.isActive) {
      const coords = getCellCoords(e);
      if (selection.end?.x !== coords.x || selection.end?.y !== coords.y) {
        dispatch(updateSelection(coords));
      }
    }
  };

  const handleMouseUp = () => {
    if (selection.isActive) {
      dispatch(endSelection());
    }
  };

  const handleMouseLeave = () => {
    if (selection.isActive) {
      dispatch(endSelection());
    }
  };

  const handleCellClick = (x, y) => {
    // If the cell is occupied, toggle its start cell status
    if (occupiedCells[y][x]) {
      dispatch(toggleStartCell({ x, y }));
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width || 0}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${height || 0}, ${cellSize}px)`,
    border: '1px solid #ccc',
    width: `${(width || 0) * cellSize}px`,
    height: `${(height || 0) * cellSize}px`,
    userSelect: 'none',
  };

  const findGroupForCell = (x, y) => {
    if (!groupList) return null;
    return groupList.find(group =>
      x >= group.x && x < group.x + group.width &&
      y >= group.y && y < group.y + group.height
    );
  };

  const isCellSelected = (x, y) => {
    if (!selection.isActive || !selection.start || !selection.end) {
      return false;
    }
    const { x: startX, y: startY } = selection.start;
    const { x: endX, y: endY } = selection.end;

    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  const renderGrid = () => {
    if (!data || data.length === 0) return null;

    const cells = [];
    for (let y = 0; y < (height || 0); y++) {
      for (let x = 0; x < (width || 0); x++) {
        const group = findGroupForCell(x, y);
        const selected = isCellSelected(x, y);
        const isStart = group && group.startCell && group.startCell.x === x && group.startCell.y === y;

        cells.push(
          <GridCell
            key={`${x}-${y}`}
            cellX={x}
            cellY={y}
            cellSize={cellSize}
            group={group}
            isSelected={selected}
            isSelectionValid={selection.isValid}
            isStartCell={isStart}
            onCellClick={handleCellClick}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div
      style={gridStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {renderGrid()}
    </div>
  );
};

export default DominoBoard;
