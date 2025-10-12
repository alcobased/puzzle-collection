import { createSlice } from '@reduxjs/toolkit';

const defaultGrid = Array(10).fill(null).map(() => Array(10).fill(null));
const initialWidth = 10;
const initialHeight = 10;

const initialGroupList = [
  { x: 0, y: 0, width: 2, height: 3, startCell: null },
  { x: 5, y: 2, width: 3, height: 4, startCell: null },
  { x: 2, y: 5, width: 2, height: 2, startCell: null },
];

const createOccupiedCells = (width, height, groupList) => {
  const occupied = Array(height).fill(null).map(() => Array(width).fill(false));
  groupList.forEach(group => {
    for (let y = group.y; y < group.y + group.height; y++) {
      for (let x = group.x; x < group.x + group.width; x++) {
        if (y < height && x < width) {
          occupied[y][x] = true;
        }
      }
    }
  });
  return occupied;
};

const initialState = {
  grid: {
    data: defaultGrid,
    width: initialWidth,
    height: initialHeight,
    occupiedCells: createOccupiedCells(initialWidth, initialHeight, initialGroupList),
    groups: {
      groupList: initialGroupList,
      selection: {
        isActive: false,
        start: null,
        end: null,
        isValid: true,
      },
    },
  },
};

const isSelectionValid = (selection, occupiedCells, height, width) => {
  if (!selection.start || !selection.end) return true;

  const { x: x1, y: y1 } = selection.start;
  const { x: x2, y: y2 } = selection.end;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (y >= height || x >= width || (occupiedCells[y] && occupiedCells[y][x])) {
        return false;
      }
    }
  }
  return true;
};

const dominoSlice = createSlice({
  name: 'domino',
  initialState,
  reducers: {
    setGridDimensions: (state, action) => {
      const { width, height } = action.payload;
      state.grid.width = width;
      state.grid.height = height;

      // Reset groups and regenerate grids
      state.grid.groups.groupList = [];
      state.grid.data = Array(height).fill(null).map(() => Array(width).fill(null));
      state.grid.occupiedCells = createOccupiedCells(width, height, []);
    },
    setGridState: (state, action) => {
      state.grid = action.payload;
    },
    updateCell: (state, action) => {
      const { x, y, value } = action.payload;
      if (state.grid.data[y]) {
        state.grid.data[y][x] = value;
      }
    },
    resetGroups: (state) => {
      state.grid.groups.groupList = [];
      state.grid.occupiedCells = createOccupiedCells(state.grid.width, state.grid.height, []);
    },
    startSelection: (state, action) => {
      const { x, y } = action.payload;
      if (state.grid.occupiedCells[y] && !state.grid.occupiedCells[y][x]) {
        state.grid.groups.selection.isActive = true;
        state.grid.groups.selection.start = action.payload;
        state.grid.groups.selection.end = action.payload;
        state.grid.groups.selection.isValid = true;
      }
    },
    updateSelection: (state, action) => {
      if (state.grid.groups.selection.isActive) {
        state.grid.groups.selection.end = action.payload;
        state.grid.groups.selection.isValid = isSelectionValid(
          state.grid.groups.selection,
          state.grid.occupiedCells,
          state.grid.height,
          state.grid.width
        );
      }
    },
    endSelection: (state) => {
      const { selection } = state.grid.groups;
      if (selection.isActive && selection.start && selection.end && selection.isValid) {
        const { x: x1, y: y1 } = selection.start;
        const { x: x2, y: y2 } = selection.end;

        const newGroup = {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x1 - x2) + 1,
          height: Math.abs(y1 - y2) + 1,
          startCell: null,
        };

        state.grid.groups.groupList.push(newGroup);

        // Update occupiedCells for the new group
        for (let y = newGroup.y; y < newGroup.y + newGroup.height; y++) {
          for (let x = newGroup.x; x < newGroup.x + newGroup.width; x++) {
            if (y < state.grid.height && x < state.grid.width) {
              state.grid.occupiedCells[y][x] = true;
            }
          }
        }
      }
      // Reset selection state regardless of validity
      selection.isActive = false;
      selection.start = null;
      selection.end = null;
      selection.isValid = true;
    },
    toggleStartCell: (state, action) => {
      const { x, y } = action.payload;
    
      // Find the group that contains the cell (x, y)
      const groupIndex = state.grid.groups.groupList.findIndex(group => 
        x >= group.x && x < group.x + group.width &&
        y >= group.y && y < group.y + group.height
      );
    
      if (groupIndex !== -1) {
        const group = state.grid.groups.groupList[groupIndex];
        // If the start cell is already this cell, toggle it off.
        if (group.startCell && group.startCell.x === x && group.startCell.y === y) {
          state.grid.groups.groupList[groupIndex].startCell = null;
        } else {
          // Otherwise, set it as the new start cell for that group.
          state.grid.groups.groupList[groupIndex].startCell = { x, y };
        }
      }
    },
  },
});

export const {
  setGridDimensions,
  setGridState,
  updateCell,
  resetGroups,
  startSelection,
  updateSelection,
  endSelection,
  toggleStartCell,
} = dominoSlice.actions;

export default dominoSlice.reducer;
