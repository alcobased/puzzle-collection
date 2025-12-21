import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../../features/ui/uiSlice";
import { toggleSingleWordList } from "../../../features/words/wordsSlice";

const ControlsWords = () => {
  const dispatch = useDispatch();

  const currentMode = useSelector((state) => state.words.singleWordList);

  const MODE_SINGLE_WORD_LIST = "Single";
  const MODE_MULTI_WORD_LIST = "Multi";

  const handleWordModeChange = (event) => {
    dispatch(toggleSingleWordList());
  };

  const openWordManager = () => {
    // Dispatch with an empty props object to maintain a consistent state shape
    dispatch(showModal({ type: "WORD_MANAGER", props: {} }));
  };

  return (
    <div className="control-section">
      <h4>Word Lists</h4>
      <button onClick={openWordManager}>Manage Words</button>
      <div className="radio-group-segmented">
        <input
          type="radio"
          id="mode-single-word-list"
          name="word-list-mode-selection"
          value={MODE_SINGLE_WORD_LIST}
          checked={currentMode === MODE_SINGLE_WORD_LIST.toLocaleLowerCase()}
          onChange={handleWordModeChange}
        />
        <label htmlFor="mode-single-word-list">{MODE_SINGLE_WORD_LIST}</label>
        <input
          type="radio"
          id="mode-multi-word-list"
          name="word-list-mode-selection"
          value={MODE_MULTI_WORD_LIST}
          checked={currentMode === MODE_MULTI_WORD_LIST.toLocaleLowerCase()}
          onChange={handleWordModeChange}
        />
        {/* Label for 'Image' mode */}
        <label htmlFor="mode-multi-word-list">{MODE_MULTI_WORD_LIST}</label>
      </div>
    </div>
  );
};

export default ControlsWords;
