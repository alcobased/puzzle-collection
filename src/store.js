import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import imageReducer from "./features/image/imageSlice.js";
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
} from "./features/pathfinder/pathfinderSlice.js";
import uiReducer from "./features/ui/uiSlice.js";
import wordReducer, {
  addList,
  removeList,
  addWord,
  addWords,
  removeWord,
  setWords,
  setWordsState,
} from "./features/words/wordsSlice.js";
import solverReducer, {
  clearSolution,
} from "./features/pathfinder/solverSlice.js";

const pathfinderReducer = combineReducers({
  cells: cellReducer,
  solver: solverReducer,
});

const puzzlesReducer = combineReducers({
  pathfinder: pathfinderReducer,
});

const rootReducer = combineReducers({
  image: imageReducer,
  words: wordReducer,
  puzzles: puzzlesReducer,
  ui: uiReducer,
});

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    addCell,
    setCells,
    setCellState,
    enqueue,
    popFromActiveQueue,
    setQueueSet,
    addQueue,
    removeQueue,
    assignChar,
    addList,
    removeList,
    addWord,
    addWords,
    removeWord,
    setWords,
    setWordsState
  ),
  effect: (action, listenerApi) => {
    listenerApi.dispatch(clearSolution());
  },
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export default store;
