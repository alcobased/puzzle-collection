import { createSlice } from '@reduxjs/toolkit';

// Create a default 10x10 grid for initial state
const defaultGrid = Array(10).fill(null).map(() => Array(10).fill(null));

const initialState = {
  grid: {
    data: defaultGrid,
    width: 10,
    height: 10,
    // Sample groups for demonstration purposes
    groups: [
      { x: 0, y: 0, width: 2, height: 3 },
      { x: 5, y: 2, width: 3, height: 4 },
      { x: 2, y: 5, width: 2, height: 2 },
    ],
  },
  // Other state properties for the domino puzzle can be added here
};

const dominoSlice = createSlice({
  name: 'domino',
  initialState,
  reducers: {
    // Example reducer to update the entire grid configuration
    setGridState: (state, action) => {
      state.grid = action.payload;
    },
    // Reducer to update a single cell's data
    updateCell: (state, action) => {
      const { x, y, value } = action.payload;
      if (state.grid.data[y]) {
        state.grid.data[y][x] = value;
      }
    },
  },
});

export const { setGridState, updateCell } = dominoSlice.actions;

export default dominoSlice.reducer;
