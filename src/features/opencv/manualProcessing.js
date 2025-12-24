
// Helper to convert an OpenCV Mat back to a data URL to be displayed in an <img> tag
const matToDataUrl = (mat) => {
    const canvas = document.createElement('canvas');
    cv.imshow(canvas, mat);
    return canvas.toDataURL();
}

// Takes an array of 4 points and returns an object with the points
// correctly identified as tl, tr, bl, br.
export const orderPoints = (points) => {
    // Find the centroid of the points
    const center = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    center.x /= 4;
    center.y /= 4;

    // Sort points based on their quadrant relative to the centroid
    const sortedPoints = points.sort((a, b) => {
        const angleA = Math.atan2(a.y - center.y, a.x - center.x);
        const angleB = Math.atan2(b.y - center.y, b.x - center.x);
        return angleA - angleB;
    });
    
    // The sorted points will be in a consistent order (e.g., TL, BL, BR, TR).
    // We need to identify the exact corner of each.
    // The point with the smallest sum of coords is TL, largest is BR.
    const sums = sortedPoints.map(p => p.x + p.y);
    const diffs = sortedPoints.map(p => p.y - p.x);

    const tl = sortedPoints[sums.indexOf(Math.min(...sums))];
    const br = sortedPoints[sums.indexOf(Math.max(...sums))];
    const tr = sortedPoints[diffs.indexOf(Math.min(...diffs))];
    const bl = sortedPoints[diffs.indexOf(Math.max(...diffs))];

    return { tl, tr, bl, br };
}


// canvasEl is the <canvas> element from the InteractiveCanvas component
export const fix_perspective = (canvasEl, perspectivePoints, cv) => {
    const src = cv.imread(canvasEl);

    // Order the points robustly
    const { tl, tr, bl, br } = orderPoints(perspectivePoints);

    // Define the destination rectangle based on the distances between the points.
    const widthA = Math.hypot(br.x - bl.x, br.y - bl.y);
    const widthB = Math.hypot(tr.x - tl.x, tr.y - tl.y);
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.hypot(tr.x - br.x, tr.y - br.y);
    const heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y);
    const maxHeight = Math.max(heightA, heightB);

    if (maxWidth <= 0 || maxHeight <= 0) {
        src.delete();
        throw new Error("Perspective dimensions must be positive.");
    }

    // Define the source and destination quadrilaterals for the initial transform
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, maxWidth - 1, 0, maxWidth - 1, maxHeight - 1, 0, maxHeight - 1]);

    // Get the initial perspective transform matrix
    const M = cv.getPerspectiveTransform(srcTri, dstTri);

    // --- New logic to prevent cropping ---

    // Get the corners of the original image
    const { cols, rows } = src.size();
    const corners = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, cols - 1, 0, cols - 1, rows - 1, 0, rows - 1]);
    const transformedCorners = new cv.Mat();

    // Apply the perspective transform to the corners to find the new bounding box
    cv.perspectiveTransform(corners, transformedCorners, M);
    const [c1x, c1y, c2x, c2y, c3x, c3y, c4x, c4y] = transformedCorners.data32F;

    // Find the min/max x and y of the transformed corners
    const minX = Math.min(c1x, c2x, c3x, c4x);
    const minY = Math.min(c1y, c2y, c3y, c4y);
    const maxX = Math.max(c1x, c2x, c3x, c4x);
    const maxY = Math.max(c1y, c2y, c3y, c4y);

    // Calculate the new output image size
    const newWidth = Math.ceil(maxX - minX);
    const newHeight = Math.ceil(maxY - minY);
    const dsize = new cv.Size(newWidth, newHeight);

    // Create a translation matrix to shift the transformed image
    // so that its top-left corner is at (0, 0) in the output image.
    const translationMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [1, 0, -minX, 0, 1, -minY, 0, 0, 1]);
    
    // Combine the translation with the original perspective transform
    const adjustedM = new cv.Mat();
    cv.gemm(translationMatrix, M, 1, new cv.Mat(), 0, adjustedM, 0); // adjustedM = translationMatrix * M

    // Warp the original image using the adjusted matrix and new size
    const warped = new cv.Mat();
    cv.warpPerspective(src, warped, adjustedM, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // --- End new logic ---

    // Convert the final Mat to a data URL for display
    const dataUrl = matToDataUrl(warped);

    // Clean up all the OpenCV Mats
    src.delete();
    warped.delete();
    M.delete();
    adjustedM.delete();
    translationMatrix.delete();
    srcTri.delete();
    dstTri.delete();
    corners.delete();
    transformedCorners.delete();

    return dataUrl;
};
