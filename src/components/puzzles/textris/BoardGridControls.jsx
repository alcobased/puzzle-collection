import { useSelector, useDispatch } from "react-redux";
import {setBoardDimensions} from "../../../features/textris/textrisSlice"

const BoardGridControls = () => {
  const dispatch = useDispatch();
  const { width, height } = useSelector((state) => state.puzzles.textris.boardGrid);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const newDimensions = {
      width,
      height,
      [name]: parseInt(value, 10),
    };
    dispatch(setBoardDimensions(newDimensions));
  };

  return (
    <div className="control-section">
      <h4>Board Grid</h4>
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

export default BoardGridControls;
