import { useSelector, useDispatch } from "react-redux";
import { setCellState } from "../../features/pathfinder/pathfinderSlice.js";
import { setWordsState } from "../../features/words/wordsSlice.js";
import { setImageState } from "../../features/image/imageSlice.js";
import { setNotification } from "../../features/ui/uiSlice.js";

const ControlsStorage = () => {
  const pathfinder = useSelector((state) => state.puzzles.pathfinder);
  const words = useSelector((state) => state.words);
  const image = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const handleSaveToLocalStorage = () => {
    localStorage.setItem("crossword-builder-pathfinder", JSON.stringify(pathfinder));
    localStorage.setItem("crossword-builder-words", JSON.stringify(words));
    localStorage.setItem("crossword-builder-image", JSON.stringify(image));
    dispatch(setNotification("Crossword saved to local storage!"));
  };

  const handleLoadFromLocalStorage = () => {
    const savedPathfinder = localStorage.getItem("crossword-builder-pathfinder");
    if (savedPathfinder) {
      dispatch(setCellState(JSON.parse(savedPathfinder)));
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
      pathfinder,
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
        if (data.pathfinder) {
          dispatch(setCellState(data.pathfinder));
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
      <label className="file-upload-label">
        Load from File
        <input type="file" accept=".json" onChange={handleLoadFromFile} style={{ display: 'none' }}/>
      </label>
    </fieldset>
  );
};

export default ControlsStorage;
