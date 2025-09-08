import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App.jsx";
import "./App.css";

import imageReducer from "./reducers/imageReducer.js";
import cellReducer from "./reducers/cellReducer.js";
import uiReducer from "./reducers/uiReducer.js";
import wordReducer from "./reducers/wordReducer.js";

const store = configureStore({
  reducer: {
    image: imageReducer,
    cells: cellReducer,
    ui: uiReducer,
    words: wordReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
