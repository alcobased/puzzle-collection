import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPieceId: null,
  placedPieces: {}, // e.g., { 'piece-1': { x: 0, y: 0 } }
};

const solverSlice = createSlice({
  name: 'textrisSolver',
  initialState,
  reducers: {
    selectPiece: (state, action) => {
      state.selectedPieceId = state.selectedPieceId === action.payload ? null : action.payload;
    },
    placePiece: (state, action) => {
      const { pieceId, x, y } = action.payload;
      state.placedPieces[pieceId] = { x, y };
      state.selectedPieceId = null;
    },
    movePlacedPiece: (state, action) => {
        const { pieceId, x, y } = action.payload;
        if (state.placedPieces[pieceId]) {
            state.placedPieces[pieceId] = { x, y };
        }
    },
    returnPieceToContainer: (state, action) => {
        const { pieceId } = action.payload;
        delete state.placedPieces[pieceId];
    }
  },
});

export const { selectPiece, placePiece, movePlacedPiece, returnPieceToContainer } = solverSlice.actions;
export default solverSlice.reducer;
