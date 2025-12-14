import { createSlice } from "@reduxjs/toolkit";

const defaultQueueId = "default-queue-0";

const pathfinderSlice = createSlice({
  name: "pathfinder",
  initialState: {
    boardType: "grid",
    grid: {
      width: 10,
      height: 10,
    },
    cells: {
      // A collection of cell objects, each with an ID, char
      // Each cell has a normalized position data relative to a background image
      // for when board is image type
      // Alternatively, each cell has a position data as a coordinate for when board is grid type
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
    solver: {
      connections: {},
      paths: [],
      solutionVisible: false,
      currentSolutionIndex: 0,
    },
  },
  reducers: {
    // Reducer for settting the whole pathfinder state
    // This is used for loading from local storage or file
    setPathfinderState(state, action) {
      return action.payload;
    },
    // Reducer for toggling the board type
    toggleBoardType(state) {
      state.boardType = state.boardType === "free" ? "grid" : "free";
    },
    // Reducer for adding a single cell to the cellSet
    addCell(state, action) {
      const { id, x, y } = action.payload;
      state.cells.cellSet[id] = {
        id: id,
        normalizedPosition: { x, y },
        char: null,
        solutionChar: null,
      };
    },
    // Reducer for replacing the entire cellSet
    setCells(state, action) {
      state.cells.cellSet = action.payload;
    },
    // Reducer for adding a cell ID to the active queue
    enqueue(state, action) {
      if (
        state.cells.activeQueue &&
        state.cells.queueSet[state.cells.activeQueue]
      ) {
        state.cells.queueSet[state.cells.activeQueue].push(action.payload);
      }
    },
    dequeue(state) {
      const activeQueueId = state.cells.activeQueue;
      if (activeQueueId && state.cells.queueSet[activeQueueId]) {
        state.cells.queueSet[activeQueueId].pop();
      }
    },
    popAndPurge(state) {
      const activeQueueId = state.cells.activeQueue;
      if (activeQueueId && state.cells.queueSet[activeQueueId]) {
        const queue = state.cells.queueSet[activeQueueId];
        if (queue.length > 0) {
          const poppedCellId = queue.pop();

          // Check if the popped cell is still in any other queue
          const isCellInAnyQueue = Object.values(state.cells.queueSet).some(
            (q) => q.includes(poppedCellId)
          );

          // If not, remove the cell from the cellSet
          if (!isCellInAnyQueue) {
            delete state.cells.cellSet[poppedCellId];
            // Also, if the popped cell was the active cell, reset it
            if (state.cells.activeCell === poppedCellId) {
              state.cells.activeCell = null;
            }
          }
        }
      }
    },
    // Reducer for replacing the entire queueSet
    setQueueSet(state, action) {
      state.cells.queueSet = action.payload;
    },
    // Reducer for creating a new queue
    addQueue(state, action) {
      const { id } = action.payload;
      if (state.cells.queueSet[id] === undefined) {
        state.cells.queueSet[id] = [];
      }
      state.cells.activeQueue = id;
    },
    // Reducer for removing a queue
    removeQueue(state, action) {
      const idToRemove = action.payload;
      if (Object.keys(state.cells.queueSet).length <= 1) {
        console.warn("Cannot remove the last queue.");
        return; // Prevent removing the last queue
      }

      const cellsInRemovedQueue = state.cells.queueSet[idToRemove] || [];

      delete state.cells.queueSet[idToRemove];

      const allRemainingCellIds = new Set(
        Object.values(state.cells.queueSet).flat()
      );

      cellsInRemovedQueue.forEach((cellId) => {
        if (!allRemainingCellIds.has(cellId)) {
          delete state.cells.cellSet[cellId];
        }
      });

      // If the active queue was the one removed, set a new active queue
      if (state.cells.activeQueue === idToRemove) {
        state.cells.activeQueue = Object.keys(state.cells.queueSet)[0];
      }
    },
    // Reducer for setting the active queue
    setActiveQueue(state, action) {
      state.cells.activeQueue = action.payload;
    },
    // Reducer for setting the active cell
    setActiveCell(state, action) {
      state.cells.activeCell = action.payload;
    },
    // Reducer for updating cell styles
    setCellStyle(state, action) {
      state.cells.cellStyle = { ...state.cells.cellStyle, ...action.payload };
    },
    // Reducer for assigning a character to a cell
    assignChar(state, action) {
      const { cellId, char } = action.payload;
      const cellToUpdate = state.cells.cellSet[cellId];
      if (cellToUpdate) {
        cellToUpdate.char = char ? char.toUpperCase() : char;
      }
    },
    setSolutionChar(state, action) {
      const { cellId, char } = action.payload;
      const cellToUpdate = state.cells.cellSet[cellId];
      if (cellToUpdate) {
        cellToUpdate.solutionChar = char;
      }
    },
    clearSolutionChars(state) {
      for (const cellId in state.cells.cellSet) {
        state.cells.cellSet[cellId].solutionChar = null;
      }
    },
    setConnections(state, action) {
      state.solver.connections = action.payload;
    },
    setPaths(state, action) {
      state.solver.paths = action.payload;
    },
    toggleSolution(state) {
      state.solver.solutionVisible = !state.solver.solutionVisible;
    },
    nextSolution(state) {
      state.solver.currentSolutionIndex =
        (state.solver.currentSolutionIndex + 1) % state.solver.paths.length;
    },
    previousSolution(state) {
      state.solver.currentSolutionIndex =
        (state.solver.currentSolutionIndex - 1 + state.solver.paths.length) %
        state.solver.paths.length;
    },
    clearSolution(state) {
      state.solver.paths = [];
      state.solver.solutionVisible = false;
      state.solver.currentSolutionIndex = 0;
    },
  },
});

export const {
  setPathfinderState,
  addCell,
  setCells,
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
  setConnections,
  setPaths,
  toggleSolution,
  nextSolution,
  previousSolution,
  clearSolution,
} = pathfinderSlice.actions;

export default pathfinderSlice.reducer;
