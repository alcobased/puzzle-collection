
export const processImage = (cv, imgElement, refs, settings) => {
  const { grayCanvasRef, threshCanvasRef, linesCanvasRef, finalCanvasRef } = refs;
  const { blurKernelSize } = settings;

  const src = cv.imread(imgElement);
  if (src.cols === 0 || src.rows === 0) return;

  let gray = new cv.Mat();
  let thresh = new cv.Mat();
  let horizontal = new cv.Mat();
  let vertical = new cv.Mat();
  let gridSkeleton = new cv.Mat();

  try {
    // STAGE 1: Grayscale & Pre-filtering
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.medianBlur(gray, gray, blurKernelSize);
    cv.imshow(grayCanvasRef.current, gray);

    // STAGE 2: High-Threshold Adaptive Binarization
    cv.adaptiveThreshold(
      gray,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      11,
      20
    );

    // STAGE 3: Morphological Extraction of the Grid
    let horizSize = Math.floor(thresh.cols / 25);
    let horizKernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(horizSize, 1)
    );
    cv.erode(thresh, horizontal, horizKernel);
    cv.dilate(horizontal, horizontal, horizKernel);

    let vertSize = Math.floor(thresh.rows / 25);
    let vertKernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(1, vertSize)
    );
    cv.erode(thresh, vertical, vertKernel);
    cv.dilate(vertical, vertical, vertKernel);

    cv.add(horizontal, vertical, gridSkeleton);
    cv.imshow(threshCanvasRef.current, gridSkeleton);

    // STAGE 4: Bounding Box and Normalization
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      gridSkeleton,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let minX = src.cols,
      minY = src.rows,
      maxX = 0,
      maxY = 0;
    for (let i = 0; i < contours.size(); ++i) {
      let rect = cv.boundingRect(contours.get(i));
      if (rect.width > 100 && rect.height > 100) {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }
    }

    cv.imshow(linesCanvasRef.current, gridSkeleton);

    // STAGE 5: Final Crop and Resize
    if (maxX > minX) {
      let roiRect = new cv.Rect(minX, minY, maxX - minX, maxY - minY);
      let cropped = src.roi(roiRect);
      let final = new cv.Mat();
      cv.resize(
        cropped,
        final,
        new cv.Size(800, 800),
        0,
        0,
        cv.INTER_LINEAR
      );
      cv.imshow(finalCanvasRef.current, final);

      cropped.delete();
      final.delete();
    }

    horizKernel.delete();
    vertKernel.delete();
    contours.delete();
    hierarchy.delete();
  } catch (err) {
    console.error("OpenCV Pipeline Error:", err);
  } finally {
    // Explicitly delete all Mats to prevent memory leaks
    src.delete();
    gray.delete();
    thresh.delete();
    horizontal.delete();
    vertical.delete();
    gridSkeleton.delete();
  }
};
