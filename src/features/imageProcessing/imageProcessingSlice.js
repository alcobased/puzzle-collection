
import { createSlice } from '@reduxjs/toolkit';
import { AppConfig } from '../../config';

const initialState = {
  imageSrc: null,
  stage: 'load',
  perspectivePoints: [],
  trimmingPoints: [],
  finalImage: null,
  statusText: 'Please load an image to begin.',
  sizeMultiplier: AppConfig.imageProcessingDefaults.sizeMultiplier,
  gridImage: null,
  rowCount: AppConfig.imageProcessingDefaults.rowCount,
  colCount: AppConfig.imageProcessingDefaults.colCount,
  bias: AppConfig.imageProcessingDefaults.bias,
  extractedCells: {},
  skipPreprocessing: AppConfig.imageProcessingDefaults.skipPreprocessing,
};

export const imageProcessingSlice = createSlice({
  name: 'imageProcessing',
  initialState,
  reducers: {
    setImageSrc: (state, action) => {
      state.imageSrc = action.payload;
    },
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    addPerspectivePoint: (state, action) => {
      if (state.perspectivePoints.length < 4) {
        state.perspectivePoints.push(action.payload);
      }
    },
    clearPerspectivePoints: (state) => {
      state.perspectivePoints = [];
    },
    addTrimmingPoint: (state, action) => {
      if (state.trimmingPoints.length < 4) {
        state.trimmingPoints.push(action.payload);
      }
    },
    clearTrimmingPoints: (state) => {
      state.trimmingPoints = [];
    },
    setFinalImage: (state, action) => {
      state.finalImage = action.payload;
    },
    setStatusText: (state, action) => {
      state.statusText = action.payload;
    },
    setSizeMultiplier: (state, action) => {
      state.sizeMultiplier = action.payload;
    },
    setGridImage: (state, action) => {
      state.gridImage = action.payload;
    },
    setRowCount: (state, action) => {
        state.rowCount = action.payload;
    },
    setColCount: (state, action) => {
        state.colCount = action.payload;
    },
    setBias: (state, action) => {
      state.bias = action.payload;
    },
    setExtractedCells: (state, action) => {
      state.extractedCells = action.payload;
    },
    toggleCellActive: (state, action) => {
      const { row, col } = action.payload;
      const cellKey = `${col}-${row}`;
      const cell = state.extractedCells[cellKey];
      if (cell) {
        cell.active = !cell.active;
      }
    },
    setSkipPreprocessing: (state, action) => {
      state.skipPreprocessing = action.payload;
    },
    resetImageProcessingState: (state) => {
      return initialState;
    }
  },
});

export const {
  setImageSrc,
  setStage,
  addPerspectivePoint,
  clearPerspectivePoints,
  addTrimmingPoint,
  clearTrimmingPoints,
  setFinalImage,
  setStatusText,
  setSizeMultiplier,
  setGridImage,
  setRowCount,
  setColCount,
  setBias,
  setExtractedCells,
  toggleCellActive,
  setSkipPreprocessing,
  resetImageProcessingState,
} = imageProcessingSlice.actions;

export default imageProcessingSlice.reducer;
