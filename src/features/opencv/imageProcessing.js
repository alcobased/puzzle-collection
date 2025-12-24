export const processImage = (cv, imgElement, refs, settings) => {
  const {
    grayCanvasRef,
    threshCanvasRef,
    perspectiveCanvasRef,
    linesCanvasRef,
    finalCanvasRef,
  } = refs;
  const { blurKernelSize, adaptiveThresholdBlockSize, adaptiveThresholdC } =
    settings;

  let src = cv.imread(imgElement);
  if (src.cols === 0 || src.rows === 0) return;

  // --- Mats --- //
  let gray = new cv.Mat();
  let thresh = new cv.Mat();
  let perspectiveCorrectedSrc = new cv.Mat();
  let perspectiveCorrectedThresh = new cv.Mat();
  let horizontal = new cv.Mat();
  let vertical = new cv.Mat();
  let gridSkeleton = new cv.Mat();
  let linesWithBox = new cv.Mat();
  // --- End Mats --- //

  try {
    // === STAGE 1: Grayscale & Pre-filtering ===
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.medianBlur(gray, gray, blurKernelSize);
    cv.imshow(grayCanvasRef.current, gray);

    // === STAGE 2: High-Threshold Adaptive Binarization ===
    cv.adaptiveThreshold(
      gray,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      adaptiveThresholdBlockSize,
      adaptiveThresholdC
    );
    cv.imshow(threshCanvasRef.current, thresh);

    // === STAGE 3: Perspective Correction via Extreme Points ===
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      thresh,
      contours,
      hierarchy,
      cv.RETR_LIST, // Find all contours
      cv.CHAIN_APPROX_SIMPLE
    );

    if (contours.size() > 0) {
      let tl = { x: Infinity, y: Infinity, sum: Infinity };
      let tr = { x: 0, y: Infinity, diff: -Infinity };
      let bl = { x: Infinity, y: 0, diff: Infinity };
      let br = { x: 0, y: 0, sum: -Infinity };

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const data = contour.data32S;
        for (let j = 0; j < data.length; j += 2) {
          const x = data[j];
          const y = data[j + 1];
          const sum = x + y;
          const diff = x - y;

          if (sum < tl.sum) tl = { x, y, sum };
          if (sum > br.sum) br = { x, y, sum };
          if (diff > tr.diff) tr = { x, y, diff };
          if (diff < bl.diff) bl = { x, y, diff };
        }
        contour.delete();
      }

      const widthA = Math.hypot(br.x - bl.x, br.y - bl.y);
      const widthB = Math.hypot(tr.x - tl.x, tr.y - tl.y);
      const maxWidth = Math.max(widthA, widthB);

      const heightA = Math.hypot(tr.x - br.x, tr.y - br.y);
      const heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y);
      const maxHeight = Math.max(heightA, heightB);

      const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y,
      ]);

      const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1,
      ]);

      const M = cv.getPerspectiveTransform(srcTri, dstTri);
      const dsize = new cv.Size(maxWidth, maxHeight);
      cv.warpPerspective(src, perspectiveCorrectedSrc, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      cv.warpPerspective(thresh, perspectiveCorrectedThresh, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
      
      cv.imshow(perspectiveCanvasRef.current, perspectiveCorrectedThresh);

      M.delete();
      srcTri.delete();
      dstTri.delete();

    } else {
      // Fallback if no contours found at all
      perspectiveCorrectedSrc = src.clone();
      perspectiveCorrectedThresh = thresh.clone();
      cv.imshow(perspectiveCanvasRef.current, thresh);
    }
    
    contours.delete();
    hierarchy.delete();
    
    // === STAGE 4: Morphological Extraction of the Grid ===
    const processMat = perspectiveCorrectedThresh;
    let horizSize = Math.floor(processMat.cols / 30);
    let horizKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(horizSize, 1));
    cv.erode(processMat, horizontal, horizKernel);
    cv.dilate(horizontal, horizontal, horizKernel);

    let vertSize = Math.floor(processMat.rows / 30);
    let vertKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, vertSize));
    cv.erode(processMat, vertical, vertKernel);
    cv.dilate(vertical, vertical, vertKernel);

    cv.add(horizontal, vertical, gridSkeleton);

    // === STAGE 5: Bounding Box and Visualization ===
    let vizContours = new cv.MatVector();
    let vizHierarchy = new cv.Mat();
    cv.findContours(gridSkeleton, vizContours, vizHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let minX = processMat.cols, minY = processMat.rows, maxX = 0, maxY = 0;
    for (let i = 0; i < vizContours.size(); ++i) {
      let rect = cv.boundingRect(vizContours.get(i));
      // Heuristic: only consider large contours to be part of the grid
      if (rect.width > 30 && rect.height > 30) { 
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }
      vizContours.get(i).delete();
    }
    vizContours.delete();
    vizHierarchy.delete();


    cv.cvtColor(gridSkeleton, linesWithBox, cv.COLOR_GRAY2RGBA);
    if (maxX > minX && maxX <= processMat.cols && maxY <= processMat.rows) {
      const point1 = new cv.Point(minX, minY);
      const point2 = new cv.Point(maxX, maxY);
      const color = [255, 0, 0, 255]; // Red
      cv.rectangle(linesWithBox, point1, point2, color, 2, cv.LINE_AA, 0);
    }
    cv.imshow(linesCanvasRef.current, linesWithBox);

    // === STAGE 6: Final Crop and Resize ===
    if (maxX > minX && maxX <= processMat.cols && maxY <= processMat.rows) {
      let roiRect = new cv.Rect(minX, minY, maxX - minX, maxY - minY);
      let cropped = perspectiveCorrectedSrc.roi(roiRect);
      let final = new cv.Mat();
      cv.resize(cropped, final, new cv.Size(800, 800), 0, 0, cv.INTER_LINEAR);
      cv.imshow(finalCanvasRef.current, final);
      cropped.delete();
      final.delete();
    }

    // --- Cleanup --- //
    horizKernel.delete();
    vertKernel.delete();

  } catch (err) {
    console.error("OpenCV Pipeline Error:", err);
  } finally {
    // Explicitly delete all Mats to prevent memory leaks
    src.delete();
    gray.delete();
    thresh.delete();
    perspectiveCorrectedSrc.delete();
    perspectiveCorrectedThresh.delete();
    horizontal.delete();
    vertical.delete();
    gridSkeleton.delete();
    linesWithBox.delete();
  }
};
