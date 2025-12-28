import { createSlice } from "@reduxjs/toolkit";

const pathfinderSlice = createSlice({
  name: "pathfinder",
  initialState: {
    boardMode: "image",
    grid: {
      width: 20,
      height: 20,
    },
    cells: {
      // A collection of cell objects, each with an ID, char
      // Each cell has a normalized position data relative to a background image
      // for when board is image type
      // Alternatively, each cell has a position data as a coordinate for when board is grid type
      cellSet: {},
      // A collection of queues, where each queue is an array of cell IDs
      queueSet: {},
      // Coordinates of selected cells on grid type board
      selectedCells: [],
      // The ID of the currently active queue
      activeQueue: null,
      // Default styles for a cell, can be configured.
      cellStyle: {
        width: 20, // px
        height: 20, // px
        fontSize: 16, // px
      },
      selectionStartCell: null,
      selectionEndCell: null,
      queueStartCell: null,
      markingStartCell: false,
      queueFlashing: {
        currentQueue: null,
        currentCellIndex: null,
      },
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
    // Reducer for setting a board mode
    setBoardMode(state, action) {
      state.boardMode = action.payload;
    },
    setGridSize(state, action) {
      const { width, height } = action.payload;
      state.grid.width = width;
      state.grid.height = height;
    },
    // Reducer for toggling the board type
    toggleBoardMode(state) {
      state.boardMode = state.boardMode === "image" ? "grid" : "image";
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
      state.cells.queueSet[id] = [];
      state.cells.activeQueue = id;
    },
    // Reducer for removing a queue
    removeQueue(state, action) {
      const idToRemove = action.payload;
      const cellsInRemovedQueue = state.cells.queueSet[idToRemove];
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
    setSelectionStartCell(state, action) {
      state.cells.selectionStartCell = action.payload;
    },
    clearSelectionStartCell(state) {
      state.cells.selectionStartCell = null;
    },
    setSelectionEndCell(state, action) {
      state.cells.selectionEndCell = action.payload;
    },
    clearSelectionEndCell(state) {
      state.cells.selectionEndCell = null;
    },
    addSeletedCells(state, action) {
      // action.payload will include two cells
      // all cells between them will be added to seleted cells
      const { c1, c2 } = action.payload;
      const minX = Math.min(c1.x, c2.x);
      const minY = Math.min(c1.y, c2.y);
      const maxX = Math.max(c1.x, c2.x);
      const maxY = Math.max(c1.y, c2.y);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const id = `${x},${y}`;
          state.cells.cellSet[id] = {
            id: id,
            gridPosition: { x, y },
            char: null,
            solutionChar: null,
          };
        }
      }
    },
    clearSelectedCells(state) {
      state.cells.selectedCells = [];
    },
    resetCells(state) {
      state.cells.cellSet = {};
      state.cells.queueSet = {};
      state.cells.activeQueue = null;
      state.cells.activeCell = null;
      state.cells.selectionStartCell = null;
      state.cells.selectionEndCell = null;
      state.cells.selectedCells = [];
    },
    setQueueStartCell(state, action) {
      state.cells.queueStartCell = action.payload;
    },
    clearQueueStartCell(state) {
      state.cells.queueStartCell = null;
    },
    toggleMarkingStartCell(state) {
      state.cells.markingStartCell = !state.cells.markingStartCell;
    },
    setFlashingCurrentQueue(state, action) {
      state.cells.queueFlashing.currentQueue = action.payload;
      state.cells.queueFlashing.currentCellIndex = 0;
    },
    incrementFlashingCurrentCellIndex(state) {
      if (!state.cells.queueFlashing.currentQueue) {
        return;
      }
      const currentQueue =
        state.cells.queueSet[state.cells.queueFlashing.currentQueue];
      if (!currentQueue) {
        return;
      }
      state.cells.queueFlashing.currentCellIndex++;
      if (currentQueue.length <= state.cells.queueFlashing.currentCellIndex) {
        state.cells.queueFlashing.currentQueue = null;
        state.cells.queueFlashing.currentCellIndex = null;
      }
    },
  },
});

export const {
  setPathfinderState,
  setBoardMode,
  setGridSize,
  toggleBoardMode,
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
  setSelectionStartCell,
  clearSelectionStartCell,
  setSelectionEndCell,
  clearSelectionEndCell,
  addSeletedCells,
  clearSelectedCells,
  resetCells,
  setQueueStartCell,
  clearQueueStartCell,
  toggleMarkingStartCell,
  setFlashingCurrentQueue,
  incrementFlashingCurrentCellIndex,
} = pathfinderSlice.actions;

export default pathfinderSlice.reducer;
