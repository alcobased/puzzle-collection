import { createSlice } from "@reduxjs/toolkit";

const solverSlice = createSlice({
  name: "solver",
  initialState: {
    connections: {},
    paths: [],
    solutionVisible: false,
    currentSolutionIndex: 0,
  },
  reducers: {
    setConnections(state, action) {
      state.connections = action.payload;
    },
    setPaths(state, action) {
      state.paths = action.payload;
    },
    toggleSolution(state) {
      state.solutionVisible = !state.solutionVisible;
    },
    nextSolution(state) {
      state.currentSolutionIndex =
        (state.currentSolutionIndex + 1) % state.paths.length;
    },
    previousSolution(state) {
      state.currentSolutionIndex =
        (state.currentSolutionIndex - 1 + state.paths.length) %
        state.paths.length;
    },
    clearSolution(state) {
      state.paths = [];
      state.solutionVisible = false;
      state.currentSolutionIndex = 0;
    },
  },
});

export const {
  setConnections,
  setPaths,
  toggleSolution,
  nextSolution,
  previousSolution,
  clearSolution,
} = solverSlice.actions;

export default solverSlice.reducer;
