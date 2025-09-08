import { useSelector, useDispatch } from "react-redux";
import { setCells } from "../../reducers/cellReducer";

const ControlsStorage = () => {
  const cells = useSelector((state) => state.cells);
  const dispatch = useDispatch();

  const handleSave = () => {
    localStorage.setItem("cells", JSON.stringify(cells));
  };

  const handleLoad = () => {
    const savedCells = localStorage.getItem("cells");
    if (savedCells) {
      dispatch(setCells(JSON.parse(savedCells)));
    }
  };

  return (
    <fieldset>
        <legend>Storage</legend>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
    </fieldset>
);

};

export default ControlsStorage;
