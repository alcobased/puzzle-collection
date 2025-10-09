import React from 'react';
import { useSelector } from 'react-redux';
import GridCell from './GridCell';

const DominoGrid = () => {
  // Correct the selector to point to state.puzzles.domino
  const gridState = useSelector((state) => state.puzzles.domino.grid);

  // If gridState is not yet available, render nothing.
  if (!gridState) {
    return null;
  }

  // Destructure the properties from the nested grid object
  const { data, width, height, groups } = gridState;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width || 0}, 50px)`,
    gridTemplateRows: `repeat(${height || 0}, 50px)`,
    border: '1px solid #ccc',
    width: `${(width || 0) * 50}px`,
    height: `${(height || 0) * 50}px`,
  };

  const findGroupForCell = (x, y) => {
    if (!groups) return null;
    return groups.find(group =>
      x >= group.x && x < group.x + group.width &&
      y >= group.y && y < group.y + group.height
    );
  };

  const renderGrid = () => {
    // Check against `data` (the 2D array) now
    if (!data || data.length === 0) return null;

    const cells = [];
    // Use `height` and `width` from the destructured gridState
    for (let y = 0; y < (height || 0); y++) {
      for (let x = 0; x < (width || 0); x++) {
        const group = findGroupForCell(x, y);
        cells.push(<GridCell key={`${x}-${y}`} cellX={x} cellY={y} group={group} />);
      }
    }
    return cells;
  };

  return (
    <div style={gridStyle}>
      {renderGrid()}
    </div>
  );
};

export default DominoGrid;
