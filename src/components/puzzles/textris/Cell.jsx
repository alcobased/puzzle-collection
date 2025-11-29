import React from "react";
import { useDispatch } from "react-redux";
import {
  updateShapeLocation,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursor,
  shapeOutOfBounds,
  shapeCollision,
  toggleCellToBoardMask,
} from "../../../features/textris/textrisSlice";
import { setNotification } from "../../../features/ui/uiSlice";
import "./Cell.css";

const Cell = (props) => {
  const dispatch = useDispatch();
  const {
    char,
    shapeId,
    shapeOffset,
    cellColor,
    absolutePosition, // absolute to grid
    liftedShape,
    board,
    highlighted,
    collision,
  } = props;

  const handleMouseOver = () => {
    dispatch(
      setCursor({
        boardName: board.name,
        locationOnBoard: absolutePosition,
      })
    );
    // is cell is part of a shape and a shape is not lifted
    if (shapeId && !liftedShape && !board.boardMask.isMarking) {
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
    // check if mask is being marked
    if (board.boardMask.isMarking) {
      // if cell is part of a shape, do not mark
      if (board.name === "shapesBoard") {
        dispatch(
          setNotification({
            message: "Cannot mark shapes board",
            type: "error",
          })
        );
        return;
      }
      if (char) {
        dispatch(
          setNotification({ message: "Cannot mark shape", type: "error" })
        );
        return;
      }
      dispatch(toggleCellToBoardMask(absolutePosition));
      return;
    }

    // lift if cell is part of a shape and shape is not lifted
    if (shapeId && !liftedShape) {
      dispatch(setLiftShape({ shapeId, shapeOffset, boardName: board.name }));
    }
    // if cell is lifted, place it
    if (liftedShape) {
      const newLocationOnBoard = {
        x: absolutePosition.x - liftedShape.offset.x,
        y: absolutePosition.y - liftedShape.offset.y,
      };

      const isShapeOutOfBounds = shapeOutOfBounds(
        board,
        liftedShape,
        newLocationOnBoard
      );
      if (isShapeOutOfBounds) {
        dispatch(
          setNotification({
            message: "Shape is out of bounds",
            type: "error",
          })
        );
        return;
      }
      const isShapeCollision = shapeCollision(
        board,
        liftedShape,
        newLocationOnBoard
      );
      if (isShapeCollision) {
        dispatch(
          setNotification({
            message: "Shape collision",
            type: "error",
          })
        );
        return;
      }
      dispatch(
        updateShapeLocation({
          shapeId: liftedShape.id,
          newBoardName: board.name,
          newLocationOnBoard,
        })
      );
      dispatch(clearLiftShape());
      dispatch(setNotification({ message: "Shape placed!", type: "success" }));
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
  if (collision) {
    classList.push("collision");
  }
  if (
    board.name === "solutionBoard" &&
    board.boardMask.draft[absolutePosition.y][absolutePosition.x]
  ) {
    classList.push("masked");
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
