import React from 'react';
import './GridCell.css';

const GridCell = ({ cellX, cellY, cellSize, group, isSelected, isSelectionValid }) => {
  const classNames = ['grid-cell'];

  if (group) {
    classNames.push('occupied');
    const { x: groupX, y: groupY, width: groupWidth, height: groupHeight } = group;
    if (cellY === groupY) {
      classNames.push('border-top');
    }
    if (cellY === groupY + groupHeight - 1) {
      classNames.push('border-bottom');
    }
    if (cellX === groupX) {
      classNames.push('border-left');
    }
    if (cellX === groupX + groupWidth - 1) {
      classNames.push('border-right');
    }
  }

  if (isSelected) {
    classNames.push('selected');
    if (!isSelectionValid) {
      classNames.push('invalid');
    }
  }

  const style = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
  };

  return (
    <div
      className={classNames.join(' ')}
      style={style}
    >
      {/* Cell content will be added later */}
    </div>
  );
};

export default React.memo(GridCell);
