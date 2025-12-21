import { useDispatch, useSelector } from "react-redux";
// Assuming you want to explicitly pass the mode to a new action,
// or stick to the toggle if the reducer handles it contextually.
import {
  toggleBoardMode,
  resetCells,
} from "../../../features/pathfinder/pathfinderSlice.js";

const MODE_GRID = "Grid";
const MODE_IMAGE = "Image";

const ControlsBoardMode = () => {
  const dispatch = useDispatch();
  const currentGridMode = useSelector(
    (state) => state.puzzles.pathfinder.boardMode
  );
  // When a radio button is clicked, we need to dispatch an action.
  // For a clean implementation, you would use a 'setBoardMode' action
  // with a payload (e.g., dispatch(setBoardMode(e.target.value))).
  // Since we only have 'toggleBoardMode', we use a generic handler
  // that relies on the dispatch flipping the state if the mode is different.
  const handleModeChange = (event) => {
    // Only dispatch if the user clicks a mode that is not currently active
    if (event.target.value !== currentGridMode) {
      dispatch(toggleBoardMode());
      dispatch(resetCells());
    }
  };
  return (
    <div className="control-section">
      <h4>Board Mode Toggle</h4>
      {/* NEW: Container for the segmented button group */}
      <div className="radio-group-segmented">
        {/* Radio Button for 'Grid' */}
        <input
          type="radio"
          id="mode-grid"
          name="board-mode-selection" // All radio buttons in a group must share the same name
          value={MODE_GRID}
          checked={currentGridMode === MODE_GRID.toLocaleLowerCase()}
          onChange={handleModeChange}
        />
        {/* Label for 'Grid' mode - must follow the input for the CSS adjacent selector (+) */}
        <label htmlFor="mode-grid">{MODE_GRID}</label>

        {/* Radio Button for 'Image' */}
        <input
          type="radio"
          id="mode-image"
          name="board-mode-selection" // Same name as above
          value={MODE_IMAGE}
          checked={currentGridMode === MODE_IMAGE.toLocaleLowerCase()}
          onChange={handleModeChange}
        />
        {/* Label for 'Image' mode */}
        <label htmlFor="mode-image">{MODE_IMAGE}</label>
      </div>
    </div>
  );
};

export default ControlsBoardMode;
