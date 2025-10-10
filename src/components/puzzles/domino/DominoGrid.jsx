import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GridCell from './GridCell';
import { endSelection } from '../../../features/domino/dominoSlice';

const DominoGrid = () => {
  const dispatch = useDispatch();
  const { grid } = useSelector((state) => state.puzzles.domino);

  if (!grid) {
    return null;
  }

  const { data, width, height, groups } = grid;
  const { groupList, selection } = groups;

  const handleMouseUp = () => {
    dispatch(endSelection());
  };

  const handleMouseLeave = () => {
    if (selection.isActive) {
      dispatch(endSelection());
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width || 0}, 50px)`,
    gridTemplateRows: `repeat(${height || 0}, 50px)`,
    border: '1px solid #ccc',
    width: `${(width || 0) * 50}px`,
    height: `${(height || 0) * 50}px`,
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
        cells.push(
          <GridCell
            key={`${x}-${y}`}
            cellX={x}
            cellY={y}
            group={group}
            isSelected={selected}
            isSelectionValid={selection.isValid}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div
      style={gridStyle}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {renderGrid()}
    </div>
  );
};

export default DominoGrid;
