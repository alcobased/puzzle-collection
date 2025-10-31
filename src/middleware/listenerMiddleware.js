import {
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";

// Import actions from pathfinder slice
import {
  addCell,
  setCells,
  setCellState,
  enqueue,
  dequeue,
  popAndPurge,
  setQueueSet,
  addQueue,
  removeQueue,
  assignChar,
} from "../features/pathfinder/pathfinderSlice.js";

// Import actions from words slice
import {
  addList,
  removeList,
  addWord,
  addWords,
  removeWord,
  setWords,
  setWordsState,
} from "../features/words/wordsSlice.js";

// Import actions from solver slice
import { clearSolution } from "../features/pathfinder/solverSlice.js";

// Create the middleware instance
export const listenerMiddleware = createListenerMiddleware();

// Add the listener
listenerMiddleware.startListening({
  matcher: isAnyOf(
    addCell,
    setCells,
    setCellState,
    enqueue,
    dequeue,
    popAndPurge,
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
    // When any of the matched actions are dispatched, clear the solution
    listenerApi.dispatch(clearSolution());
  },
});
