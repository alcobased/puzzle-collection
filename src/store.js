import { configureStore } from "@reduxjs/toolkit";

import imageReducer from "./reducers/imageReducer.js";
import cellReducer, {
  addCell,
  setCells,
  setCellState,
  enqueue,
  popFromActiveQueue,
  setQueueSet,
  addQueue,
  removeQueue,
  assignChar,
} from "./reducers/cellReducer.js";
import uiReducer from "./reducers/uiReducer.js";
import wordReducer, {
  addList,
  removeList,
  addWord,
  addWords,
  removeWord,
  setWords,
  setWordsState,
} from "./reducers/wordReducer.js";
import solverReducer, { clearSolution } from "./reducers/solverReducer.js";

const solutionClearingActions = [
  addCell.type,
  setCells.type,
  setCellState.type,
  enqueue.type,
  popFromActiveQueue.type,
  setQueueSet.type,
  addQueue.type,
  removeQueue.type,
  assignChar.type,
  addList.type,
  removeList.type,
  addWord.type,
  addWords.type,
  removeWord.type,
  setWords.type,
  setWordsState.type,
];

const solutionClearerMiddleware = (store) => (next) => (action) => {
  if (solutionClearingActions.includes(action.type)) {
    store.dispatch(clearSolution());
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    image: imageReducer,
    cells: cellReducer,
    ui: uiReducer,
    words: wordReducer,
    solver: solverReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(solutionClearerMiddleware),
});

export default store;
