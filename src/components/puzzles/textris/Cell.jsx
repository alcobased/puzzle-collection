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
  validShapePosition,
} from "../../../features/textris/textrisSlice";
import "./Cell.css";

const Cell = ({
  char,
  cellColor,
  shapeId,
  shapeOffset,
  absolutePosition, // absolute to grid
  liftedShape,
  gridName,
  highlighted,
}) => {
  const dispatch = useDispatch();

  const handleMouseOver = () => {
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
    dispatch(clearCursorLocation());
    if (shapeId) {
      dispatch(clearHighlightShape());
    }
  };

  const handleMouseClick = () => {
    // lift if cell is part of a shape and shape is not lifted
    if (shapeId && !liftedShape) {
      dispatch(setLiftShape({ shapeId, offset: shapeOffset }));
    }
    // if cell is lifted, place it
    if (liftedShape) {
      console.log("dropping shape");

      dispatch(
        updateShapeLocationAndPosition({
          shapeId: liftedShape.shape.id,
          location: gridName,
          position: {
            x: absolutePosition.x - liftedShape.offset.x,
            y: absolutePosition.y - liftedShape.offset.y,
          },
        })
      );
      dispatch(clearLiftShape());
    }
  };

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
