import { useSelector, useDispatch } from "react-redux";
import { updateBoardDimensions } from "../../../features/textris/textrisSlice";

const BoardControls = ({ boardName }) => {
  const dispatch = useDispatch();

  const { width, height } = useSelector(
    (state) => state.puzzles.textris[boardName]
  );

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const newDimensions = {
      width,
      height,
      [name]: parseInt(value, 10),
    };
    dispatch(updateBoardDimensions({ boardName, ...newDimensions }));
  };

  return (
    <div className="control-section">
      <h4>
        {boardName === "solutionBoard" ? "Solution Board" : "Puzzle Board"}{" "}
        Controls
      </h4>
      <label htmlFor="width">Width</label>
      <input
        type="number"
        id="width"
        name="width"
        value={width || ""}
        onChange={handleDimensionChange}
        min="1"
      />
      <label htmlFor="height">Height</label>
      <input
        type="number"
        id="height"
        name="height"
        value={height || ""}
        onChange={handleDimensionChange}
        min="1"
      />
    </div>
  );
};

export default BoardControls;
