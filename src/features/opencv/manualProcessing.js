
// Helper to convert an OpenCV Mat back to a data URL to be displayed in an <img> tag
const matToDataUrl = (mat) => {
    const canvas = document.createElement('canvas');
    cv.imshow(canvas, mat);
    return canvas.toDataURL();
}

const getDist = (p1, p2) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Takes an array of 4 points and returns an object with the points
// correctly identified as tl, tr, bl, br.
export const orderPoints = (points) => {
    // The Python script assumes a fixed order, but this is more robust.
    // We'll sort by x-coordinate to find left/right pairs, then by y.
    const pts = [...points].sort((a, b) => a.x - b.x);
    
    const leftMost = pts.slice(0, 2).sort((a,b) => a.y - b.y);
    const rightMost = pts.slice(2, 4).sort((a, b) => a.y - b.y);

    const [tl, bl] = leftMost;
    const [tr, br] = rightMost;

    return { tl, tr, bl, br };
}


// imgEl is the <img> element with the original image
export const fix_perspective = (imgEl, perspectivePoints, cv, sizeMultiplier = 2) => {
    const src = cv.imread(imgEl);

    // Order the points robustly, ensuring we know which corner is which.
    const { tl, tr, bl, br } = orderPoints(perspectivePoints);

    // 1. Approximate the intended Width and Height from the clicks (from python script)
    const widthTop = getDist(tl, tr);
    const widthBot = getDist(bl, br);
    const avgW = (widthTop + widthBot) / 2;

    const heightLeft = getDist(tl, bl);
    const heightRight = getDist(tr, br);
    const avgH = (heightLeft + heightRight) / 2;

    if (avgW <= 0 || avgH <= 0) {
        src.delete();
        throw new Error("Perspective dimensions must be positive.");
    }

    // 2. Setup a large canvas to prevent clipping
    const srcW = src.size().width;
    const srcH = src.size().height;
    const outW = srcW * sizeMultiplier;
    const outH = srcH * sizeMultiplier;
    const dsize = new cv.Size(outW, outH);

    // 3. Center the result in the large canvas
    const offX = (outW - avgW) / 2;
    const offY = (outH - avgH) / 2;

    const srcCoords = [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y];
    const dstCoords = [
        offX, offY,
        offX + avgW, offY,
        offX + avgW, offY + avgH,
        offX, offY + avgH
    ];
    
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, srcCoords);
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dstCoords);

    // 4. Warp with white background
    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const warped = new cv.Mat();
    const borderValue = new cv.Scalar(255, 255, 255, 255);
    cv.warpPerspective(src, warped, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, borderValue);

    const dataUrl = matToDataUrl(warped);

    // Clean up
    src.delete();
    warped.delete();
    M.delete();
    srcTri.delete();
    dstTri.delete();

    return dataUrl;
};

export const trim_image = (imgEl, trimPoints, cv) => {
    const src = cv.imread(imgEl);

    // Points are in order: top, right, bottom, left
    const [top, right, bottom, left] = trimPoints;

    const x = left.x;
    const y = top.y;
    const width = right.x - x;
    const height = bottom.y - y;

    if (width <= 0 || height <= 0) {
        src.delete();
        throw new Error("Trim dimensions must be positive.");
    }

    const rect = new cv.Rect(x, y, width, height);
    const trimmed = src.roi(rect);

    const dataUrl = matToDataUrl(trimmed);

    src.delete();
    trimmed.delete();

    return dataUrl;
};
