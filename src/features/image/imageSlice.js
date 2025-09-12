import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  src: null,
  naturalDimensions: { width: 0, height: 0 },
  rendered: {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setSrc(state, action) {
      state.src = action.payload.src;
      state.naturalDimensions = action.payload.dimensions;
      // Reset rendered geometry when a new image is set
      state.rendered = initialState.rendered;
    },
    setRendered(state, action) {
      state.rendered = action.payload;
    },
    unloadImage() {
      // Return the initial state to clear everything
      return initialState;
    },
    setImageState(state, action) {
      return action.payload;
    },
  },
});

export const { setSrc, setRendered, unloadImage, setImageState } =
  imageSlice.actions;
export default imageSlice.reducer;