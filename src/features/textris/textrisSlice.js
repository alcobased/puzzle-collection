import { createSlice } from "@reduxjs/toolkit";

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

const generateEmptyGrid = (width, height) => {
  return Array.from({ length: height }, () => Array(width).fill(false));
};

const initialSolutionBoard = {
  name: "solutionBoard",
  ...INITIAL_SOLUTION_BOARD_DIMENSIONS,
  occupiedCells: generateEmptyGrid(
    INITIAL_SOLUTION_BOARD_DIMENSIONS.width,
    INITIAL_SOLUTION_BOARD_DIMENSIONS.height
  ),
  boardMask: {
    isMarking: false,
    draft: generateEmptyGrid(
      INITIAL_SOLUTION_BOARD_DIMENSIONS.width,
      INITIAL_SOLUTION_BOARD_DIMENSIONS.height
    ),
  },
};

const initialShapesBoard = {
  name: "shapesBoard",
  ...INITIAL_SHAPES_BOARD_DIMENSIONS,
  occupiedCells: generateEmptyGrid(
    INITIAL_SHAPES_BOARD_DIMENSIONS.width,
    INITIAL_SHAPES_BOARD_DIMENSIONS.height
  ),
  boardMask: {
    isMarking: false, // this is needed to disable shape interactions on shapes board
    // draft is not needed, because shapes board does not have a mask
  },
};

const initialState = {
  solutionBoard: initialSolutionBoard,
  shapesBoard: initialShapesBoard,
  shapesCollection: [],
  highlightedShapeId: null,
  liftedShape: null,
  cursor: null,
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

  // if grid is to be expanded the values should be set to null
  const newGrid = Array.from({ length: newHeight }, () =>
    Array(newWidth).fill(null)
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

export const shapeOutOfBounds = (board, shape, newLocationOnBoard) => {
  for (let y = 0; y < shape.grid.length; y++) {
    for (let x = 0; x < shape.grid[y].length; x++) {
      if (shape.grid[y][x]) {
        const absX = newLocationOnBoard.x + x;
        const absY = newLocationOnBoard.y + y;
        if (
          absX < 0 ||
          absX >= board.width ||
          absY < 0 ||
          absY >= board.height
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const shapeCollision = (board, shape, newLocationOnBoard) => {
  for (let y = 0; y < shape.grid.length; y++) {
    for (let x = 0; x < shape.grid[y].length; x++) {
      if (shape.grid[y][x]) {
        const absX = newLocationOnBoard.x + x;
        const absY = newLocationOnBoard.y + y;
        if (
          board.occupiedCells[absY][absX] ||
          (board.boardMask.draft && board.boardMask.draft[absY][absX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const validShapeLocationOnBoard = (board, shape, newLocationOnBoard) => {
  return (
    !shapeOutOfBounds(board, shape, newLocationOnBoard) &&
    !shapeCollision(board, shape, newLocationOnBoard)
  );
};

export const findValidShapeLocationOnBoard = (board, shape) => {
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      if (validShapeLocationOnBoard(board, shape, { x, y })) {
        return { x, y };
      }
    }
  }
  return null;
};

export const textrisSlice = createSlice({
  name: "textris",
  initialState,
  reducers: {
    setTextrisState: (state, action) => {
      return action.payload;
    },

    setShapesDimensions: (state, action) => {},

    updateBoardDimensions: (state, action) => {
      const { boardName, width, height } = action.payload;
      const oldBoard = state[boardName];
      for (let r = 0; r < oldBoard.occupiedCells.length; r++) {
        for (let c = 0; c < oldBoard.occupiedCells[r].length; c++) {
          // If we find a true value...
          if (oldBoard.occupiedCells[r][c] === true) {
            // ...and it is outside the new bounds...
            if (r >= height || c >= width) {
              // ...return the original grid immediately.
              return;
            }
          }
        }
      }

      const newGrid = [];

      for (let row = 0; row < height; row++) {
        const newRow = [];
        for (let col = 0; col < width; col++) {
          // Check if the cell exists in the original grid
          if (
            oldBoard.occupiedCells[row] !== undefined &&
            oldBoard.occupiedCells[row][col] !== undefined
          ) {
            // Copy existing value
            newRow.push(oldBoard.occupiedCells[row][col]);
          } else {
            // Fill new space with false
            newRow.push(false);
          }
        }
        newGrid.push(newRow);
      }

      oldBoard.occupiedCells = newGrid;
      oldBoard.width = width;
      oldBoard.height = height;
      // reset mask if solution board dimensions are changed
      if (boardName === "solutionBoard") {
        state.solutionBoard.boardMask.draft = generateEmptyGrid(width, height);
      }
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

    updateShapeLocation: (state, action) => {
      const { shapeId, newBoardName, newLocationOnBoard } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      const board = state[newBoardName];
      if (shape) {
        shape.boardName = newBoardName;
        shape.locationOnBoard = newLocationOnBoard;
      }

      // occupiedCells in board need to be updated (set to true)
      for (let y = 0; y < shape.grid.length; y++) {
        for (let x = 0; x < shape.grid[y].length; x++) {
          if (shape.grid[y][x]) {
            board.occupiedCells[newLocationOnBoard.y + y][
              newLocationOnBoard.x + x
            ] = true;
          }
        }
      }
    },

    setHighlightShape(state, action) {
      state.highlightedShapeId = action.payload.shapeId;
    },

    clearHighlightShape(state) {
      state.highlightedShapeId = null;
    },

    setLiftShape(state, action) {
      const { shapeId, shapeOffset, boardName } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      const board = state[boardName];
      if (shape) {
        // occupiedCells in board need to be updated (set to false)
        for (let y = 0; y < shape.grid.length; y++) {
          for (let x = 0; x < shape.grid[y].length; x++) {
            if (shape.grid[y][x]) {
              board.occupiedCells[shape.locationOnBoard.y + y][
                shape.locationOnBoard.x + x
              ] = false;
            }
          }
          state.liftedShape = {
            id: shapeId,
            offset: shapeOffset,
            grid: shape.grid,
            color: shape.color,
          };
          // clear is marking mask
          board.boardMask.isMarking = false;
        }
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

    toggleIsMarkingBoardMask(state) {
      state.solutionBoard.boardMask.isMarking =
        !state.solutionBoard.boardMask.isMarking;
      state.shapesBoard.boardMask.isMarking =
        !state.shapesBoard.boardMask.isMarking;
    },

    toggleCellToBoardMask(state, action) {
      console.log("toggleCellToBoardMask", action.payload);

      const { x, y } = action.payload;
      state.solutionBoard.boardMask.draft[y][x] =
        !state.solutionBoard.boardMask.draft[y][x];
    },

    resetBoardMask(state) {
      state.solutionBoard.boardMask.draft = generateEmptyGrid(
        state.solutionBoard.width,
        state.solutionBoard.height
      );
    },
  },
});

export const {
  setTextrisState,
  updateBoardDimensions,
  setShapesDimensions,
  setShapesCollection,
  addShape,
  updateShapeLocation,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursor,
  clearCursor,
  setLastPlacementResult,
  clearLastPlacementResult,
  toggleIsMarkingBoardMask,
  toggleCellToBoardMask,
  resetBoardMask,
} = textrisSlice.actions;

export default textrisSlice.reducer;
