import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  board: {
    data: Array(20).fill(null).map(() => Array(20).fill(null)),
    width: 20,
    height: 20,
    selection: {
      isActive: false,
      start: null,
      end: null,
    },
  },
  pieces: [
    {
      id: 'piece-1',
      shape: [
        ['T', null, null],
        ['A', 'S', null],
        [null, 'O', 'C'],
      ],
    },
    {
      id: 'piece-2',
      shape: [
        [null, 'E'],
        ['P', 'I', 'E', 'C', 'E'],
        [null, 'E'],
      ],
    },
    // Add more pieces as needed based on the puzzle design
  ],
  phase: 'setup', // setup | solve
};

const textrisSlice = createSlice({
  name: 'textris',
  initialState,
  reducers: {
    setBoardDimensions: (state, action) => {
      const { width, height } = action.payload;
      state.board.width = width;
      state.board.height = height;
      state.board.data = Array(height).fill(null).map(() => Array(width).fill(null));
      state.board.selection = {
        isActive: false,
        start: null,
        end: null,
      };
    },
    startSelection: (state, action) => {
      state.board.selection.isActive = true;
      state.board.selection.start = action.payload;
      state.board.selection.end = action.payload;
    },
    moveSelection: (state, action) => {
      if (state.board.selection.isActive) {
        state.board.selection.end = action.payload;
      }
    },
    endSelection: (state) => {
      if (!state.board.selection.start || !state.board.selection.end) return;
      const { start, end } = state.board.selection;
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if (!state.board.data[y]) {
            state.board.data[y] = [];
          }
          state.board.data[y][x] = 1; // Mark as part of the board
        }
      }
      state.board.selection.isActive = false;
      state.board.selection.start = null;
      state.board.selection.end = null;
    },
    clearBoard: (state) => {
      state.board.data = Array(state.board.height).fill(null).map(() => Array(state.board.width).fill(null));
    },
    togglePhase: (state) => {
      state.phase = state.phase === 'setup' ? 'solve' : 'setup';
    },
    addPiece: (state, action) => {
      const existingIds = state.pieces.map(p => parseInt(p.id.split('-')[1], 10));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      const newPiece = {
        id: `piece-${maxId + 1}`,
        shape: action.payload.shape,
      };
      state.pieces.push(newPiece);
    },
    removePiece: (state, action) => {
        state.pieces = state.pieces.filter(piece => piece.id !== action.payload);
    }
  },
});

export const { setBoardDimensions, startSelection, moveSelection, endSelection, clearBoard, togglePhase, addPiece, removePiece } = textrisSlice.actions;
export default textrisSlice.reducer;
