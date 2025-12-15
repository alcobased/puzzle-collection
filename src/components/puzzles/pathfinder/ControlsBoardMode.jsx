import { useDispatch, useSelector } from "react-redux";
import { toggleBoardMode } from "../../../features/pathfinder/pathfinderSlice.js";

const ControlsBoardMode = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(
    (state) => state.puzzles.pathfinder.boardMode
  );
  const handleToggle = () => {
    dispatch(toggleBoardMode());
  };
  return (
    <div className="control-section">
      <h4>Board Mode Toggle</h4>
      <input
        type="checkbox"
        id="pathfinder-board-mode-input"
        onChange={handleToggle}
      />
      <label htmlFor="pathfinder-board-mode-input">{currentMode}</label>
    </div>
  );
};

export default ControlsBoardMode;
