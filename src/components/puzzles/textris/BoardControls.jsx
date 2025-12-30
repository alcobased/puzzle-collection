import { useSelector, useDispatch } from "react-redux";
import { updateBoardDimensions } from "../../../features/textris/textrisSlice";
import ControlSection from "../../common/Controls/ControlSection";

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
    console.log(newDimensions);

    dispatch(updateBoardDimensions({ boardName, ...newDimensions }));
  };

  return (
    <ControlSection title={boardName === "solutionBoard" ? "Solution Board" : "Puzzle Board"}>
      <div className="control-subsection">
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
    </ControlSection>
  );
};

export default BoardControls;
