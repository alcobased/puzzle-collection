import { useSelector, useDispatch } from "react-redux";
import { setCellState } from "../../reducers/cellReducer";
import { setWordsState } from "../../reducers/wordReducer";
import { setImageState } from "../../reducers/imageReducer";
import { setNotification } from "../../reducers/uiReducer";

const ControlsStorage = () => {
  const cells = useSelector((state) => state.cells);
  const words = useSelector((state) => state.words);
  const image = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const handleSaveToLocalStorage = () => {
    localStorage.setItem("crossword-builder-cells", JSON.stringify(cells));
    localStorage.setItem("crossword-builder-words", JSON.stringify(words));
    localStorage.setItem("crossword-builder-image", JSON.stringify(image));
    dispatch(setNotification("Crossword saved to local storage!"));
  };

  const handleLoadFromLocalStorage = () => {
    const savedCells = localStorage.getItem("crossword-builder-cells");
    if (savedCells) {
      dispatch(setCellState(JSON.parse(savedCells)));
    }
    const savedWords = localStorage.getItem("crossword-builder-words");
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      dispatch(setWordsState(parsedWords));
    }
    const savedImage = localStorage.getItem("crossword-builder-image");
    if (savedImage) {
      const parsedImage = JSON.parse(savedImage);
      dispatch(setImageState(parsedImage));
    }
    dispatch(setNotification("Crossword loaded from local storage!"));
  };

  const handleSaveToFile = () => {
    const data = {
      cells,
      words,
      image,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crossword.json";
    a.click();
    URL.revokeObjectURL(url);
    dispatch(setNotification("Crossword saved to file!"));
  };

  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.cells) {
          dispatch(setCellState(data.cells));
        }
        if (data.words) {
          dispatch(setWordsState(data.words));
        }
        if (data.image) {
          dispatch(setImageState(data.image));
        }
        dispatch(setNotification("Crossword loaded from file!"));
      } catch (error) {
        dispatch(setNotification(`Error loading file: ${error.message}`));
      }
    };
    reader.readAsText(file);
  };

  return (
    <fieldset>
      <legend>Storage</legend>
      <button onClick={handleSaveToLocalStorage}>Save to Local Storage</button>
      <button onClick={handleLoadFromLocalStorage}>Load from Local Storage</button>
      <button onClick={handleSaveToFile}>Save to File</button>
      <input type="file" accept=".json" onChange={handleLoadFromFile} />
    </fieldset>
  );
};

export default ControlsStorage;
