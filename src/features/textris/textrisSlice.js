import { createSlice } from "@reduxjs/toolkit";
import { devShapes, devBoardGrid, devShapesGrid } from "./devData";

// Initial grids will be 2d arrays filled with false value
// Initially no cells on boths grids will be occupied

const INITIAL_BOARD_GRID_DIMENSIONS = {
  width: 20,
  height: 10,
};

const INITIAL_SHAPES_GRID_DIMENSIONS = {
  width: 10,
  height: 10,
};

const initialBoardGrid = {
  name: "boardGrid",
  ...INITIAL_BOARD_GRID_DIMENSIONS,
  occupiedCells: Array.from(
    { length: INITIAL_BOARD_GRID_DIMENSIONS.height },
    () => Array(INITIAL_BOARD_GRID_DIMENSIONS.width).fill(false)
  ),
};

const initialShapesGrid = {
  name: "shapesGrid",
  ...INITIAL_SHAPES_GRID_DIMENSIONS,
  occupiedCells: Array.from(
    { length: INITIAL_SHAPES_GRID_DIMENSIONS.height },
    () => Array(INITIAL_SHAPES_GRID_DIMENSIONS.width).fill(false)
  ),
};

const initialState = {
  boardGrid: initialBoardGrid,
  shapesGrid: initialShapesGrid,
  shapesCollection: [],
  highlightedShapeId: null,
  selectedShape: {
    id: null,
    relativePosition: null,
    absolutePosition: null,
    gridName: null,
  },
  lastPlacementResult: {
    status: null,
    msg: null,
  },
};

const initialStateDev = {
  boardGrid: devBoardGrid,
  shapesGrid: devShapesGrid,
  shapesCollection: devShapes,
  highlightedShapeId: null,
  liftedShape: {
    id: null,
    offset: {
      x: null,
      y: null,
    },
  },
  cursorLocation: {
    gridName: null,
    position: {
      x: null,
      y: null,
    },
  },
  lastPlacementResult: {
    status: null,
    msg: null,
  },
};

export const updateGrid = (grid, newWidth, newHeight) => {
  const { width: oldWidth, height: oldHeight, occupiedCells } = grid;

  // if newWidth and/or newHeight is lower than existing grid
  // a check needs to be made ensuring that trimmed cells
  // are not occupied
  if (newWidth < oldWidth || newHeight < oldHeight) {
    for (let y = 0; y < oldHeight; y++) {
      for (let x = 0; x < oldWidth; x++) {
        if (occupiedCells[y][x] && (y >= newHeight || x >= newWidth)) {
          // if occupied cells are detected amongst cells to be trimmed
          // function should return grid unchanged
          return grid;
        }
      }
    }
  }

  // if grid is to be expanded the values should be set to false
  const newOccupiedCells = Array.from({ length: newHeight }, () =>
    Array(newWidth).fill(false)
  );

  const heightToCopy = Math.min(oldHeight, newHeight);
  const widthToCopy = Math.min(oldWidth, newWidth);

  for (let y = 0; y < heightToCopy; y++) {
    for (let x = 0; x < widthToCopy; x++) {
      newOccupiedCells[y][x] = occupiedCells[y][x];
    }
  }

  return {
    ...grid,
    width: newWidth,
    height: newHeight,
    occupiedCells: newOccupiedCells,
  };
};

export const validShapePosition = (grid, shape, position) => {
  for (let y = 0; y < shape.grid.length; y++) {
    for (let x = 0; x < shape.grid[y].length; x++) {
      if (shape.grid[y][x]) {
        const absX = position.x + x;
        const absY = position.y + y;
        if (
          absX < 0 ||
          absX >= grid.width ||
          absY < 0 ||
          absY >= grid.height ||
          grid.occupiedCells[absY][absX]
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const findValidShapePosition = (grid, shape) => {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (validShapePosition(grid, shape, { x, y })) {
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
    setBoardDimensions: (state, action) => {
      const { width, height } = action.payload;
      state.boardGrid = updateGrid(state.boardGrid, width, height);
    },
    setShapesDimensions: (state, action) => {
      const { width, height } = action.payload;
      state.shapesGrid = updateGrid(state.shapesGrid, width, height);
    },
    setShapesCollection: (state, action) => {
      state.shapesCollection = action.payload;
    },
    addShape: (state, action) => {
      const { id, grid, color } = action.payload;
      state.shapesCollection.push({
        id,
        grid,
        location: null,
        position: null,
        color,
      });
    },
    updateShapeLocationAndPosition: (state, action) => {
      const { shapeId, location, position } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      if (shape) {
        shape.location = location;
        shape.position = position;
      }
    },
    setHighlightShape(state, action) {
      state.highlightedShapeId = action.payload.shapeId;
    },
    clearHighlightShape(state) {
      state.highlightedShapeId = null;
    },
    setLiftShape(state, action) {
      const { shapeId, offset } = action.payload;
      const shape = state.shapesCollection.find(
        (shape) => shape.id === shapeId
      );
      if (shape) {
        state.liftedShape = {
          id: shapeId,
          offset,
        };
      }
    },
    clearLiftShape(state) {
      state.liftedShape = {
        id: null,
        offset: {
          x: null,
          y: null,
        },
      };
    },
    setCursorLocation(state, action) {
      state.cursorLocation = action.payload;
    },
    clearCursorLocation(state) {
      state.cursorLocation = {
        gridName: null,
        position: {
          x: null,
          y: null,
        },
      };
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
  setBoardDimensions,
  setShapesDimensions,
  setShapesCollection,
  addShape,
  updateShapeLocationAndPosition,
  setHighlightShape,
  clearHighlightShape,
  setLiftShape,
  clearLiftShape,
  setCursorLocation,
  clearCursorLocation,
  setLastPlacementResult,
  clearLastPlacementResult,
} = textrisSlice.actions;

export default textrisSlice.reducer;
