import React from "react";
import { useDispatch } from "react-redux";
import {
  setBoardDimensions,
  setShapesDimensions,
  setShapesCollection,
  addShape,
  updateShapeLocationAndPosition,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursorLocation,
  clearCursorLocation,
  setLastPlacementResult,
  clearLastPlacementResult,
} from "../../../features/textris/textrisSlice";
import "./Cell.css";

const Cell = ({
  char,
  cellColor,
  shapeId,
  absolutePosition, // absolute to grid
  liftedShape,
  gridName,
  highlighted,
}) => {
  const dispatch = useDispatch();

  const handleMouseOver = () => {
    console.log("mouse over", absolutePosition, gridName);
    dispatch(
      setCursorLocation({
        gridName,
        position: absolutePosition,
      })
    );
    // is cell is part of a shape and a shape is not lifted
    if (shapeId) {
      dispatch(setHighlightShape({ shapeId }));
    }
  };

  const handleMouseLeave = () => {
    if (shapeId) {
      dispatch(clearHighlightShape());
    }
  };

  const handleMouseClick = () => {};

  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  const classList = ["cell", "textris-cell"];

  if (highlighted) {
    classList.push("highlighted");
  }
  if (cellColor) {
    classList.push(cellColor);
  }

  return (
    <div
      className={classList.join(" ")}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onClick={handleMouseClick}
    >
      {char}
    </div>
  );
};

export default Cell;
