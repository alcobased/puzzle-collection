import { createSlice } from "@reduxjs/toolkit";

const defaultQueueId = "default-queue-0";

const cellSlice = createSlice({
  name: "cells",
  initialState: {
    // A collection of cell objects, each with an ID, normalized position and char
    cellSet: {},
    // A collection of queues, where each queue is an array of cell IDs
    queueSet: {
      [defaultQueueId]: [],
    },
    // The ID of the currently active queue
    activeQueue: defaultQueueId,
    // Default styles for a cell, can be configured.
    cellStyle: {
      width: 20, // px
      height: 20, // px
      fontSize: 16, // px
    },
    // The ID of the currently active/selected cell
    activeCell: null,
  },
  reducers: {
    // Reducer for adding a single cell to the cellSet
    addCell(state, action) {
      const { id, x, y } = action.payload;
      state.cellSet[id] = {
        id: id,
        normalizedPosition: { x, y },
        char: null,
        solutionChar: null,
      };
    },
    // Reducer for replacing the entire cellSet
    setCells(state, action) {
      state.cellSet = action.payload;
    },
    setCellState(state, action) {
      return action.payload;
    },
    // Reducer for adding a cell ID to the active queue
    enqueue(state, action) {
      if (state.activeQueue && state.queueSet[state.activeQueue]) {
        state.queueSet[state.activeQueue].push(action.payload);
      }
    },
    dequeue(state) {
      const activeQueueId = state.activeQueue;
      if (activeQueueId && state.queueSet[activeQueueId]) {
        const queue = state.queueSet[activeQueueId];
        if (queue.length > 0) {
          queue.pop();
        }
      }
    },
    popAndPurge(state) {
      const activeQueueId = state.activeQueue;
      if (activeQueueId && state.queueSet[activeQueueId]) {
        const queue = state.queueSet[activeQueueId];
        if (queue.length > 0) {
          const poppedCellId = queue.pop();

          // Check if the popped cell is still in any other queue
          const isCellInAnyQueue = Object.values(state.queueSet).some(q => q.includes(poppedCellId));

          // If not, remove the cell from the cellSet
          if (!isCellInAnyQueue) {
            delete state.cellSet[poppedCellId];
            // Also, if the popped cell was the active cell, reset it
            if (state.activeCell === poppedCellId) {
                state.activeCell = null;
            }
          }
        }
      }
    },
    // Reducer for replacing the entire queueSet
    setQueueSet(state, action) {
        state.queueSet = action.payload;
    },
    // Reducer for creating a new queue
    addQueue(state, action) {
        const { id } = action.payload;
        if (state.queueSet[id] === undefined) {
            state.queueSet[id] = [];
        }
        state.activeQueue = id;
    },
    // Reducer for removing a queue
    removeQueue(state, action) {
      const idToRemove = action.payload;
      if (Object.keys(state.queueSet).length <= 1) {
        console.warn("Cannot remove the last queue.");
        return; // Prevent removing the last queue
      }

      const cellsInRemovedQueue = state.queueSet[idToRemove] || [];
      
      delete state.queueSet[idToRemove];

      const allRemainingCellIds = new Set(Object.values(state.queueSet).flat());

      cellsInRemovedQueue.forEach(cellId => {
        if (!allRemainingCellIds.has(cellId)) {
          delete state.cellSet[cellId];
        }
      });

      // If the active queue was the one removed, set a new active queue
      if (state.activeQueue === idToRemove) {
        state.activeQueue = Object.keys(state.queueSet)[0];
      }
    },
    // Reducer for setting the active queue
    setActiveQueue(state, action) {
        state.activeQueue = action.payload;
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
      const cellToUpdate = state.cellSet[cellId];
      if (cellToUpdate) {
        cellToUpdate.char = char ? char.toUpperCase() : char;
      }
    },
    setSolutionChar(state, action) {
      const { cellId, char } = action.payload;
      const cellToUpdate = state.cellSet[cellId];
      if (cellToUpdate) {
        cellToUpdate.solutionChar = char;
      }
    },
    clearSolutionChars(state) {
      for (const cellId in state.cellSet) {
        state.cellSet[cellId].solutionChar = null;
      }
    },
  },
});

export const {
  addCell,
  setCells,
  setCellState,
  enqueue,
  dequeue,
  popAndPurge,
  setQueueSet,
  addQueue,
  removeQueue,
  setActiveQueue,
  setActiveCell,
  setCellStyle,
  assignChar,
  setSolutionChar,
  clearSolutionChars,
} = cellSlice.actions;

export default cellSlice.reducer;
