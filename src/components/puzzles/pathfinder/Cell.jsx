import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  enqueue,
  popAndPurge,
} from "../../../features/pathfinder/pathfinderSlice";
import { showModal } from "../../../features/ui/uiSlice";
import "../../common/Cell.css"; // Import the new stylesheet

const Cell = ({ id, style, char, className, solutionChar }) => {
  const dispatch = useDispatch();
  const { activeQueue, queueSet } = useSelector(
    (state) => state.puzzles.pathfinder.cells
  );

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent the grid from creating a new cell
    dispatch(showModal({ type: "CELL_PROPERTIES", props: { cellId: id } }));
  };

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu
    e.stopPropagation();

    const queue = queueSet[activeQueue];
    const lastInQueue = queue[queue.length - 1];

    if (lastInQueue === id) {
      dispatch(popAndPurge());
    } else {
      dispatch(enqueue(id));
    }
  };

  return (
    <div
      className={`cell ${className}`}
      style={style}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {solutionChar || char}
    </div>
  );
};

export default Cell;
