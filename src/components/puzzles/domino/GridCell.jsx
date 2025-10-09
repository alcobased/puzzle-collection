import React from 'react';

const GridCell = ({ cellX, cellY, group }) => {
  const cellStyle = {
    width: '50px',
    height: '50px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    border: '1px solid #eee', // Default thin border
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
    <div style={cellStyle}>
      {/* Cell content will be added later */}
    </div>
  );
};

export default GridCell;
