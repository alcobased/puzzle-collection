import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "image",
  initialState: {
    image: null,
    position: { x: 0, y: 0 },
    dimensions: { width: 0, height: 0 },
  },
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
    clearImage: (state) => {
      state.image = null;
    },
    setPositionAndDimensions: (state, action) => {
      state.position = action.payload.position;
      state.dimensions = action.payload.dimensions;
    },
  },
});

export const { setImage, clearImage, setPositionAndDimensions } =
  imageSlice.actions;
export default imageSlice.reducer;
