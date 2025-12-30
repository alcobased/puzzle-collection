
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
  rowCount: 0,
  colCount: 0,
  bias: AppConfig.imageProcessingDefaults.bias,
  extractedCells: [],
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
    setPerspectivePoints: (state, action) => {
      state.perspectivePoints = action.payload;
    },
    addPerspectivePoint: (state, action) => {
      state.perspectivePoints.push(action.payload);
    },
    clearPerspectivePoints: (state) => {
      state.perspectivePoints = [];
    },
    setTrimmingPoints: (state, action) => {
      state.trimmingPoints = action.payload;
    },
    addTrimmingPoint: (state, action) => {
        state.trimmingPoints.push(action.payload);
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
    setSkipPreprocessing: (state, action) => {
      state.skipPreprocessing = action.payload;
    },
    resetImageProcessingState: (state) => {
      state.imageSrc = null;
      state.stage = 'load';
      state.perspectivePoints = [];
      state.trimmingPoints = [];
      state.finalImage = null;
      state.statusText = 'Please load an image to begin.';
      state.sizeMultiplier = AppConfig.imageProcessingDefaults.sizeMultiplier;
      state.gridImage = null;
      state.rowCount = 0;
      state.colCount = 0;
      state.bias = AppConfig.imageProcessingDefaults.bias;
      state.extractedCells = [];
      state.skipPreprocessing = AppConfig.imageProcessingDefaults.skipPreprocessing;
    }
  },
});

export const {
  setImageSrc,
  setStage,
  setPerspectivePoints,
  addPerspectivePoint,
  clearPerspectivePoints,
  setTrimmingPoints,
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
  setSkipPreprocessing,
  resetImageProcessingState,
} = imageProcessingSlice.actions;

export default imageProcessingSlice.reducer;
