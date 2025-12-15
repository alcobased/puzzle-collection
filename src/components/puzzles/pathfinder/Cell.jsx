// Cell.jsx - Refactored to be a Reusable Presentation Component
import React from "react";
// We can remove the Redux imports as they are no longer needed here
// import { useSelector, useDispatch } from "react-redux";
import "../../common/Cell.css";

const Cell = ({
  style,
  char,
  className,
  solutionChar,
  // New: Accept specific event handlers as props
  onClick,
  onContextMenu,
}) => {
  // The logic is removed, and the props are used directly.
  return (
    <div
      className={`cell ${className}`}
      style={style}
      // Use the handlers passed in from the parent
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {solutionChar || char}
    </div>
  );
};

export default Cell;
