import { useSelector, useDispatch } from "react-redux";
import { setCells } from "../../reducers/cellReducer";
import { setWordsState } from "../../reducers/wordReducer";

const ControlsStorage = () => {
  const cells = useSelector((state) => state.cells);
  const words = useSelector((state) => state.words);
  const dispatch = useDispatch();

  const handleSave = () => {
    localStorage.setItem("crossword-builder-cells", JSON.stringify(cells));
    localStorage.setItem("crossword-builder-words", JSON.stringify(words));
  };

  const handleLoad = () => {
    const savedCells = localStorage.getItem("crossword-builder-cells");
    if (savedCells) {
      dispatch(setCells(JSON.parse(savedCells)));
    }
    const savedWords = localStorage.getItem("crossword-builder-words");
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      dispatch(setWordsState(parsedWords));
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
