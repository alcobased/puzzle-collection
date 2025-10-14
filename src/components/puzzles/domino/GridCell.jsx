import React from 'react';
import { useDispatch } from 'react-redux';
import './GridCell.css';
import { setActiveCell } from '../../../features/domino/dominoSlice';
import { setModal } from '../../../features/ui/uiSlice';

const GridCell = ({ cellX, cellY, cellSize, value, group, isSelected, isSelectionValid, isStartCell }) => {
  const dispatch = useDispatch();
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

  if (isStartCell) {
    classNames.push('start-cell');
  }

  const style = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${cellSize * 0.6}px`,
  };

  const starStyle = {
    position: 'absolute',
    top: '0',
    left: '5%',
    lineHeight: '1',
    fontSize: `${cellSize * 0.5}px`,
  };

  const handleClick = () => {
    if (group) {
      dispatch(setActiveCell({ x: cellX, y: cellY }));
      dispatch(setModal('DOMINO_CELL'));
    }
  };

  return (
    <div
      className={classNames.join(' ')}
      style={style}
      onClick={handleClick}
    >
      {isStartCell && <span style={starStyle}>*</span>}
      {value}
    </div>
  );
};

export default React.memo(GridCell);
