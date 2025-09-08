import React from "react";
import { useDispatch } from "react-redux";
import { setActiveCell } from "../../reducers/cellReducer";
import { openModal } from "../../reducers/uiReducer";

const GridCell = ({ id, style, char, className }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent the grid from creating a new cell
    dispatch(setActiveCell(id));
    dispatch(openModal({ modalType: 'CELL_PROPERTIES' }));
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
    >
      {char}
    </div>
  );
};

export default GridCell;
