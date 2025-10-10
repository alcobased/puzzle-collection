
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  startSelection,
  updateSelection,
} from '../../../features/domino/dominoSlice';

const GridCell = ({ cellX, cellY, group, isSelected, isSelectionValid }) => {
  const dispatch = useDispatch();

  const handleMouseDown = () => {
    dispatch(startSelection({ x: cellX, y: cellY }));
  };

  const handleMouseEnter = () => {
    dispatch(updateSelection({ x: cellX, y: cellY }));
  };

  let backgroundColor = 'transparent';
  if (isSelected) {
    backgroundColor = isSelectionValid 
      ? 'rgba(100, 100, 255, 0.3)' // Valid selection: light blue
      : 'rgba(255, 100, 100, 0.3)'; // Invalid selection: light red
  }

  const cellStyle = {
    width: '50px',
    height: '50px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    backgroundColor,
  };

  if (group) {
    const { x: groupX, y: groupY, width: groupWidth, height: groupHeight } = group;
    const borderThickness = '2px';
    const borderColor = '#333';

    if (cellY === groupY) {
      cellStyle.borderTop = `${borderThickness} solid ${borderColor}`;
    }
    if (cellY === groupY + groupHeight - 1) {
      cellStyle.borderBottom = `${borderThickness} solid ${borderColor}`;
    }
    if (cellX === groupX) {
      cellStyle.borderLeft = `${borderThickness} solid ${borderColor}`;
    }
    if (cellX === groupX + groupWidth - 1) {
      cellStyle.borderRight = `${borderThickness} solid ${borderColor}`;
    }
  }

  return (
    <div
      style={cellStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {/* Cell content will be added later */}
    </div>
  );
};

export default GridCell;
