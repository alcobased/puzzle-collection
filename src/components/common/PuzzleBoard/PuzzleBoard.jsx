import React from "react";
import { useSelector } from "react-redux";

const PuzzleBoard = ({ children }) => {
  const rendered = useSelector((state) => state.image.rendered);
  const { width, height, top, left } = rendered;

  return (
    <div
      id="board"
      style={{
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { rendered });
        }
        return child;
      })}
    </div>
  );
};

export default PuzzleBoard;
