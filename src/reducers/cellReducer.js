import { createSlice } from "@reduxjs/toolkit";

const cellSlice = createSlice({
  name: "cells",
  initialState: {
    // Array of cell objects, each with an ID, normalized position and char
    cellSet: [],
    // Array of cell ids
    queue: [],
    // Default styles for a cell, can be configured.
    cellStyle: {
      width: 20, // px
      height: 20, // px
      border: "1px solid black",
      backgroundColor: "rgb(255, 255, 255)",
    },
    // The ID of the currently active/selected cell
    activeCell: null,
  },
  reducers: {
    // Reducer for adding a single cell to the cellSet
    addCell(state, action) {
      const { id, x, y } = action.payload;
      state.cellSet.push({
        id: id,
        normalizedPosition: { x, y },
        char: null,
      });
    },
    // Reducer for replacing the entire cellSet
    setCells(state, action) {
      state.cellSet = action.payload;
    },
    // Reducer for adding a cell ID to the queue
    enqueue(state, action) {
      state.queue.push(action.payload);
    },
    // Reducer for replacing the entire queue
    setQueue(state, action) {
      state.queue = action.payload;
    },
    // Reducer for setting the active cell
    setActiveCell(state, action) {
      state.activeCell = action.payload;
    },
    // Reducer for updating cell styles
    setCellStyle(state, action) {
      state.cellStyle = { ...state.cellStyle, ...action.payload };
    },
    // Reducer for assigning a character to a cell
    assignChar(state, action) {
      const { cellId, char } = action.payload;
      const cellToUpdate = state.cellSet.find((cell) => cell.id === cellId);
      if (cellToUpdate) {
        cellToUpdate.char = char;
      }
    },
  },
});

export const {
  addCell,
  setCells,
  enqueue,
  setQueue,
  setActiveCell,
  setCellStyle,
  assignChar,
} = cellSlice.actions;
export default cellSlice.reducer;
