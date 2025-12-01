import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleIsMarkingBoardMask } from "../../../features/textris/textrisSlice";
import { setNotification } from "../../../features/ui/uiSlice";

const BoardMaskControls = () => {
  const dispatch = useDispatch();
  const { isMarking } = useSelector(
    (state) => state.puzzles.textris.solutionBoard.boardMask
  );
  const { liftedShape } = useSelector((state) => state.puzzles.textris);

  const handleToggle = () => {
    if (liftedShape) {
      dispatch(
        setNotification({
          message: "Cannot mark while shape is lifted",
          type: "error",
        })
      );
      return;
    }
    dispatch(toggleIsMarkingBoardMask());
  };

  return (
    <div className="control-section">
      <h4>Solution Board Mask</h4>
      {/* <p>Click on cells on the solution board to mark them as disabled.</p> */}
      <button onClick={handleToggle}>
        {isMarking ? "Apply Mask" : "Start Marking"}
      </button>
    </div>
  );
};

export default BoardMaskControls;
