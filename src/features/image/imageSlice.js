import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  src: null,
  rendered: {
    offsetWidth: 0,
    offsetHeight: 0,
    offsetTop: 0,
    offsetLeft: 0
  },
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setSrc(state, action) {
      state.src = action.payload;
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