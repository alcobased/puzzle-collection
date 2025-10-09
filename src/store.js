import {
  configureStore,
} from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import imageReducer from "./features/image/imageSlice.js";
import cellReducer from "./features/pathfinder/pathfinderSlice.js";
import uiReducer from "./features/ui/uiSlice.js";
import wordReducer from "./features/words/wordsSlice.js";
import solverReducer from "./features/pathfinder/solverSlice.js";
import dominoReducer from "./features/domino/dominoSlice.js";

import { listenerMiddleware } from "./middleware/listenerMiddleware.js";

const pathfinderReducer = combineReducers({
  cells: cellReducer,
  solver: solverReducer,
});

const puzzlesReducer = combineReducers({
  pathfinder: pathfinderReducer,
  domino: dominoReducer,
});

const rootReducer = combineReducers({
  image: imageReducer,
  words: wordReducer,
  puzzles: puzzlesReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export default store;
