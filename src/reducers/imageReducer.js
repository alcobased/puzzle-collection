import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  position: { x: 0, y: 0 },
  dimensions: { width: 0, height: 0 },
}

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.data = action.payload;
    },
    clearImage: (state) => {
      state.data = null;
    },
    setPositionAndDimensions: (state, action) => {
      state.position.x = action.payload.x;
      state.position.y = action.payload.y;
      state.dimensions.width = action.payload.width;
      state.dimensions.height = action.payload.height;
    },
  },
});

export const { setImage, clearImage, setPositionAndDimensions } =
  imageSlice.actions;
export default imageSlice.reducer;
