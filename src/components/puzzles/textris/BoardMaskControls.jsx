import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleIsMarkingBoardMask } from "../../../features/textris/textrisSlice";

const BoardMaskControls = () => {
  const dispatch = useDispatch();
  const { isMarking } = useSelector(
    (state) => state.puzzles.textris.solutionBoard.boardMask
  );

  const handleToggle = () => {
    dispatch(toggleIsMarkingBoardMask());
  };

  return (
    <div className="control-section">
      <h3>Solution Board Mask</h3>
      {/* <p>Click on cells on the solution board to mark them as disabled.</p> */}
      <button onClick={handleToggle}>
        {isMarking ? "Apply Mask" : "Start Marking"}
      </button>
    </div>
  );
};

export default BoardMaskControls;
