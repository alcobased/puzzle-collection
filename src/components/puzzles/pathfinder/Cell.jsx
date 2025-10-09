import React from "react";
import { useDispatch } from "react-redux";
import { setActiveCell } from "../../../features/pathfinder/pathfinderSlice";
import { setModal } from "../../../features/ui/uiSlice";

const Cell = ({ id, style, char, className, solutionChar }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent the grid from creating a new cell
    dispatch(setActiveCell(id));
    dispatch(setModal('CELL_PROPERTIES'));
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

export default Cell;
