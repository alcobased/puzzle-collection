import React from "react";
import { useDispatch } from "react-redux";
import {
  updateShapeLocationAndPosition,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursor,
  clearCursor,
  setLastPlacementResult,
  clearLastPlacementResult,
  validShapePosition,
} from "../../../features/textris/textrisSlice";
import "./Cell.css";

const Cell = ({
  char,
  shapeId,
  shapeOffset,
  cellColor,
  absolutePosition, // absolute to grid
  liftedShape,
  boardName,
  highlighted,
}) => {
  const dispatch = useDispatch();

  const handleMouseOver = () => {
    dispatch(
      setCursor({
        boardName,
        locationOnBoard: absolutePosition,
      })
    );
    // is cell is part of a shape and a shape is not lifted
    if (shapeId) {
      dispatch(setHighlightShape({ shapeId }));
    }
  };

  const handleMouseLeave = () => {
    // dispatch(clearCursorLocation());
    if (shapeId) {
      dispatch(clearHighlightShape());
    }
  };

  const handleMouseClick = () => {
    // lift if cell is part of a shape and shape is not lifted
    if (shapeId && !liftedShape) {
      console.log("lifting shape");
      dispatch(setLiftShape({ shapeId, shapeOffset }));
    }
    // if cell is lifted, place it
    if (liftedShape) {
      console.log("dropping shape");
      // collision check

      dispatch(
        updateShapeLocationAndPosition({
          shapeId: liftedShape.id,
          newBoardName: boardName,
          newLocationOnBoard: {
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
