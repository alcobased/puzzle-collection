import { createSlice } from "@reduxjs/toolkit";

const solverSlice = createSlice({
  name: "solver",
  initialState: {
    connections: {},
    paths: [],
  },
  reducers: {
    setConnections(state, action) {
      state.connections = action.payload;
    },
    setPaths(state, action) {
      state.paths = action.payload;
    },
  },
});

export const { setConnections, setPaths } = solverSlice.actions;

export default solverSlice.reducer;
