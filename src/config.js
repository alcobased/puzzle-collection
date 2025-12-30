/**
 * Application-wide constants and configuration settings.
 */
export const AppConfig = {
  // The maximum number of pixels for an uploaded image before it is scaled down.
  // This is to prevent performance issues with very large images.
  MAX_IMAGE_PIXELS: 2_000_000,

  // Default values for the image processing feature.
  imageProcessingDefaults: {
    sizeMultiplier: 1,
    bias: 0.9,
    skipPreprocessing: false,
    rowCount: 10,
    colCount: 10,
    confidenceThreshold: 80,
  },
};
