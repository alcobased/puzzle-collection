import { useSelector, useDispatch } from "react-redux";
import { setPathfinderState } from "../../../features/pathfinder/pathfinderSlice.js";
import { setDominoState } from "../../../features/domino/dominoSlice.js";
import { setTextrisState } from "../../../features/textris/textrisSlice.js";
import { setWordsState } from "../../../features/words/wordsSlice.js";
import { setImageState } from "../../../features/image/imageSlice.js";
import { setNotification } from "../../../features/ui/uiSlice.js";

// Map puzzle names to their corresponding state setter actions
const puzzleStateSetters = {
  pathfinder: setPathfinderState,
  domino: setDominoState,
  textris: setTextrisState,
};

const ControlsStorage = ({ puzzleName, saveWords, saveImage }) => {
  const puzzle = useSelector((state) => state.puzzles[puzzleName]);
  const words = useSelector((state) => state.words);
  const image = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const handleSaveToLocalStorage = () => {
    localStorage.setItem(`puzzle-${puzzleName}`, JSON.stringify(puzzle));
    if (saveWords) {
      localStorage.setItem("common-words", JSON.stringify(words));
    }
    if (saveImage) {
      localStorage.setItem("common-image", JSON.stringify(image));
    }
    dispatch(
      setNotification({
        message: `Puzzle ${puzzleName} saved to local storage!`,
      })
    );
  };

  const handleLoadFromLocalStorage = () => {
    const savedPuzzle = localStorage.getItem(`puzzle-${puzzleName}`);
    if (savedPuzzle) {
      const parsedPuzzle = JSON.parse(savedPuzzle);
      dispatch(puzzleStateSetters[puzzleName](parsedPuzzle));
    }

    const savedWords = localStorage.getItem("common-words");
    if (saveWords && savedWords) {
      const parsedWords = JSON.parse(savedWords);
      dispatch(setWordsState(parsedWords));
    }
    const savedImage = localStorage.getItem("common-image");
    if (saveImage && savedImage) {
      const parsedImage = JSON.parse(savedImage);
      dispatch(setImageState(parsedImage));
    }
    dispatch(
      setNotification({
        message: `Puzzle ${puzzleName} loaded from local storage!`,
      })
    );
  };

  const handleSaveToFile = () => {
    const data = {
      puzzle: puzzle,
      words: saveWords ? words : null,
      image: saveImage ? image : null,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `puzzle-${puzzleName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    dispatch(
      setNotification({ message: `Puzzle ${puzzleName} saved to file!` })
    );
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
        if (data.puzzle) {
          dispatch(puzzleStateSetters[puzzleName](data.puzzle));
        }
        if (saveWords && data.words) {
          dispatch(setWordsState(data.words));
        }
        if (saveImage && data.image) {
          dispatch(setImageState(data.image));
        }
        dispatch(setNotification({ message: `Puzzle ${puzzleName} loaded!` }));
      } catch (error) {
        dispatch(
          setNotification({
            message: `Error loading file: ${error.message}`,
            type: "error",
          })
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="control-section">
      <h4>Storage</h4>
      <button onClick={handleSaveToLocalStorage}>Save to Local Storage</button>
      <button onClick={handleLoadFromLocalStorage}>
        Load from Local Storage
      </button>
      <button onClick={handleSaveToFile}>Save to File</button>
      <label className="file-upload-label">
        Load from File
        <input
          type="file"
          accept=".json"
          onChange={handleLoadFromFile}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default ControlsStorage;
