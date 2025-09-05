import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import imageReducer from "./reducers/imageReducer";
import cellReducer from "./reducers/cellReducer";

const store = configureStore({
  reducer: {
    image: imageReducer,
    cells: cellReducer,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
