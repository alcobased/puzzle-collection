import React from "react";
import { useDispatch } from "react-redux";
import { setActiveCell } from "../../../features/pathfinder/pathfinderSlice";
import { openModal } from "../../../features/ui/uiSlice";

const GridCell = ({ id, style, char, className, solutionChar }) => {
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
      {solutionChar || char}
    </div>
  );
};

export default GridCell;
