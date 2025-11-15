import { createSlice } from "@reduxjs/toolkit";
import { devShapes, devSolutionBoard, devShapesBoard } from "./devData";

// Initial grids will be 2d arrays filled with false values
// Initially no cells on boths grids of the boards will be occupied

const INITIAL_SOLUTION_BOARD_DIMENSIONS = {
  width: 20,
  height: 10,
};

const INITIAL_SHAPES_BOARD_DIMENSIONS = {
  width: 10,
  height: 10,
};

const initialSolutionBoard = {
  name: "solutionBoard",
  ...INITIAL_SOLUTION_BOARD_DIMENSIONS,
  grid: Array.from({ length: INITIAL_SOLUTION_BOARD_DIMENSIONS.height }, () =>
    Array(INITIAL_SOLUTION_BOARD_DIMENSIONS.width).fill(false)
  ),
};

const initialShapesBoard = {
  name: "shapesBoard",
  ...INITIAL_SHAPES_BOARD_DIMENSIONS,
  occupiedCells: Array.from(
    { length: INITIAL_SHAPES_BOARD_DIMENSIONS.height },
    () => Array(INITIAL_SHAPES_BOARD_DIMENSIONS.width).fill(false)
  ),
};

const initialState = {
  solutionBoard: initialSolutionBoard,
  shapesBoard: initialShapesBoard,
  shapesCollection: [],
  highlightedShapeId: null,
  liftedShape: null,
  cursor: null,
  lastPlacementResult: null,
};

const initialStateDev = {
  solutionBoard: devSolutionBoard,
  shapesBoard: devShapesBoard,
  shapesCollection: devShapes,
  highlightedShapeId: null,
  liftedShape: null,
  cursor: null,
  lastPlacementResult: null,
};

export const updateBoard = (board, newWidth, newHeight) => {
  const { width: oldWidth, height: oldHeight, grid } = board;

  // if newWidth and/or newHeight is lower than existing grid
  // a check needs to be made ensuring that trimmed cells
  // are not occupied
  if (newWidth < oldWidth || newHeight < oldHeight) {
    for (let y = 0; y < oldHeight; y++) {
      for (let x = 0; x < oldWidth; x++) {
        if (grid[y][x] && (y >= newHeight || x >= newWidth)) {
          // if occupied cells are detected amongst cells to be trimmed
          // function should return grid unchanged
          return board;
        }
      }
    }
  }

  // if grid is to be expanded the values should be set to false
  const newGrid = Array.from({ length: newHeight }, () =>
    Array(newWidth).fill(false)
  );

  const heightToCopy = Math.min(oldHeight, newHeight);
  const widthToCopy = Math.min(oldWidth, newWidth);

  for (let y = 0; y < heightToCopy; y++) {
    for (let x = 0; x < widthToCopy; x++) {
      newGrid[y][x] = grid[y][x];
    }
  }

  return {
    ...board,
    width: newWidth,
    height: newHeight,
    grid: newGrid,
  };
};

export const validShapePosition = (board, shape, locationOnBoard) => {
  for (let y = 0; y < shape.grid.length; y++) {
    for (let x = 0; x < shape.grid[y].length; x++) {
      if (shape.grid[y][x]) {
        const absX = locationOnBoard.x + x;
        const absY = locationOnBoard.y + y;
        if (
          absX < 0 ||
          absX >= board.width ||
          absY < 0 ||
          absY >= board.height ||
          board.grid[absY][absX]
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const findValidShapePosition = (board, shape) => {
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      if (validShapePosition(board, shape, { x, y })) {
        return { x, y };
      }
    }
  }
  return null;
};

export const textrisSlice = createSlice({
  name: "textris",
  initialState:
    process.env.NODE_ENV === "production" ? initialState : initialStateDev,
  reducers: {
    updateBoardDimensions: (state, action) => {
      const { boardName, width, height } = action.payload;
      const board = state[boardName];
      if (!board) return;
      if (width) board.width = width;
      if (height) board.height = height;
    },
    setShapesCollection: (state, action) => {
      state.shapesCollection = action.payload;
    },
    addShape: (state, action) => {
      const { id, grid, color } = action.payload;
      state.shapesCollection.push({
        id,
        boardName: null,
        locationOnBoard: null,
        grid,
        color,
      });
    },
    updateShapeLocationAndPosition: (state, action) => {
      const { shapeId, newBoardName, newLocationOnBoard } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      if (shape) {
        console.log("dispatching update shape location");

        shape.boardName = newBoardName;
        shape.locationOnBoard = newLocationOnBoard;
      }
    },
    setHighlightShape(state, action) {
      state.highlightedShapeId = action.payload.shapeId;
    },
    clearHighlightShape(state) {
      state.highlightedShapeId = null;
    },
    setLiftShape(state, action) {
      const { shapeId, shapeOffset } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      if (shape) {
        state.liftedShape = {
          id: shapeId,
          offset: shapeOffset,
          grid: shape.grid,
          color: shape.color,
        };
      }
    },
    clearLiftShape(state) {
      state.liftedShape = null;
    },
    setCursor(state, action) {
      const { boardName, locationOnBoard } = action.payload;
      state.cursor = {
        boardName,
        locationOnBoard,
      };
    },
    clearCursor(state) {
      state.cursor = null;
    },
    setLastPlacementResult(state, action) {
      state.lastPlacementResult = action.payload;
    },
    clearLastPlacementResult(state) {
      state.lastPlacementResult = {
        status: null,
        msg: null,
      };
    },
  },
});

export const {
  updateBoardDimensions,
  setShapesDimensions,
  setShapesCollection,
  addShape,
  updateShapeLocationAndPosition,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursor,
  clearCursor,
  setLastPlacementResult,
  clearLastPlacementResult,
} = textrisSlice.actions;

export default textrisSlice.reducer;
