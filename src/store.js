import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import imageReducer from "./features/image/imageSlice.js";
import pathfinderReducer from "./features/pathfinder/pathfinderSlice.js";
import uiReducer from "./features/ui/uiSlice.js";
import wordReducer from "./features/words/wordsSlice.js";
import dominoReducer from "./features/domino/dominoSlice.js";
import textrisReducer from "./features/textris/textrisSlice.js";
import codewordsReducer from "./features/codewords/codewordsSlice.js";
import imageProcessingReducer from "./features/imageProcessing/imageProcessingSlice.js";

import { listenerMiddleware } from "./middleware/listenerMiddleware.js";

import { initializeTextrisDevData } from "./features/textris/devStateInitializer.js";

const puzzlesReducer = combineReducers({
  pathfinder: pathfinderReducer,
  domino: dominoReducer,
  textris: textrisReducer,
  codewords: codewordsReducer,
});

const rootReducer = combineReducers({
  image: imageReducer,
  words: wordReducer,
  puzzles: puzzlesReducer,
  imageProcessing: imageProcessingReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// --- Conditional Dispatch for Development ---
if (process.env.NODE_ENV === "development") {
  console.log(
    "--- Development Mode: Initializing state with multiple items ---"
  );

  // Dispatch the Thunk function
  store.dispatch(initializeTextrisDevData());
}

export default store;
