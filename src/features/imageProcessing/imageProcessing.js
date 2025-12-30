const matToDataUrl = (mat) => {
    const canvas = document.createElement('canvas');
    cv.imshow(canvas, mat);
    return canvas.toDataURL('image/png');
};

export const warpPerspective = (imgSrc, perspectivePoints, sizeMultiplier = 1) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            let src;
            let dst;
            let dsize;
            let srcTri;
            let dstTri;
            let M;

            try {
                src = cv.imread(img);

                // A robust way to order the 4 points: tl, tr, br, bl
                const pts = [...perspectivePoints].map(p => ({ x: p.x, y: p.y }));
                const sums = pts.map(p => p.x + p.y);
                const diffs = pts.map(p => p.y - p.x);

                const tl = pts[sums.indexOf(Math.min(...sums))];
                const br = pts[sums.indexOf(Math.max(...sums))];
                const tr = pts[diffs.indexOf(Math.min(...diffs))];
                const bl = pts[diffs.indexOf(Math.max(...diffs))];

                // Calculate the width and height of the desired rectangle
                const widthA = Math.sqrt(Math.pow(br.x - bl.x, 2) + Math.pow(br.y - bl.y, 2));
                const widthB = Math.sqrt(Math.pow(tr.x - tl.x, 2) + Math.pow(tr.y - tl.y, 2));
                const maxWidth = Math.max(Math.floor(widthA), Math.floor(widthB));

                const heightA = Math.sqrt(Math.pow(tr.x - br.x, 2) + Math.pow(tr.y - br.y, 2));
                const heightB = Math.sqrt(Math.pow(tl.x - bl.x, 2) + Math.pow(tl.y - bl.y, 2));
                const maxHeight = Math.max(Math.floor(heightA), Math.floor(heightB));

                if (maxWidth <= 0 || maxHeight <= 0) {
                    throw new Error('Perspective dimensions must be positive.');
                }

                const w = Math.floor(maxWidth * sizeMultiplier);
                const h = Math.floor(maxHeight * sizeMultiplier);

                // Source quad is the user's selection
                srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
                    tl.x, tl.y,
                    tr.x, tr.y,
                    br.x, br.y,
                    bl.x, bl.y
                ]);

                // The destination is a perfect rectangle. We position it at the top-left
                // of the source quad's bounding box to keep the warped area in place.
                const destTl = { x: Math.min(tl.x, tr.x, br.x, bl.x), y: Math.min(tl.y, tr.y, br.y, bl.y) };

                dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
                    destTl.x, destTl.y,
                    destTl.x + w, destTl.y,
                    destTl.x + w, destTl.y + h,
                    destTl.x, destTl.y + h
                ]);

                // Calculate the transformation matrix
                M = cv.getPerspectiveTransform(srcTri, dstTri);

                // Destination image is the same size as the source
                dst = new cv.Mat();
                dsize = new cv.Size(src.cols, src.rows);

                // Apply the transformation to the entire image
                cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

                const result = {
                    image: matToDataUrl(dst),
                    width: src.cols,
                    height: src.rows,
                };

                resolve(result);

            } catch (e) {
                console.error(e);
                reject(e);
            } finally {
                if (src) src.delete();
                if (dst) dst.delete();
                if (srcTri) srcTri.delete();
                if (dstTri) dstTri.delete();
                if (M) M.delete();
            }
        };
        img.onerror = (err) => {
            reject(new Error("Failed to load image from source."));
        }
    });
};

export const trimImage = (imgSrc, trimmingPoints) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            let src;
            let dst;
            try {
                src = cv.imread(img);

                const topY = trimmingPoints[0].y;
                const rightX = trimmingPoints[1].x;
                const bottomY = trimmingPoints[2].y;
                const leftX = trimmingPoints[3].x;

                const x = Math.floor(Math.min(leftX, rightX));
                const y = Math.floor(Math.min(topY, bottomY));
                const width = Math.floor(Math.abs(rightX - leftX));
                const height = Math.floor(Math.abs(bottomY - topY));

                if (width <= 0 || height <= 0) {
                    throw new Error("Trim dimensions must be positive.");
                }

                const rect = new cv.Rect(x, y, width, height);
                dst = src.roi(rect);

                const result = {
                    image: matToDataUrl(dst),
                    width: width,
                    height: height
                };

                resolve(result);
            } catch (e) {
                reject(e);
            } finally {
                if (src) src.delete();
                if (dst) dst.delete();
            }
        };
        img.onerror = (err) => {
            reject(new Error("Failed to load image from source."));
        }
    });
};

export const extractGridStructure = (imgSrc, rowCount, colCount, cellPadding) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            let src;
            try {
                src = cv.imread(img);
                const cells = [];
                const cellWidth = src.cols / colCount;
                const cellHeight = src.rows / rowCount;

                for (let r = 0; r < rowCount; r++) {
                    for (let c = 0; c < colCount; c++) {
                        const baseX = c * cellWidth;
                        const baseY = r * cellHeight;

                        // Calculate expansion
                        const expansionX = cellWidth * cellPadding;
                        const expansionY = cellHeight * cellPadding;

                        // Center align the expansion
                        let x = baseX - (expansionX / 2);
                        let y = baseY - (expansionY / 2);
                        let w = cellWidth + expansionX;
                        let h = cellHeight + expansionY;

                        // Clamp to image boundaries (ensure ROI is within the image)
                        if (x < 0) {
                            w += x; // reduce width by the amount we shifted x back to 0
                            x = 0;
                        }
                        if (y < 0) {
                            h += y; // reduce height by the amount we shifted y back to 0
                            y = 0;
                        }
                        if (x + w > src.cols) {
                            w = src.cols - x;
                        }
                        if (y + h > src.rows) {
                            h = src.rows - y;
                        }

                        // Ensure integers for cv.Rect
                        x = Math.floor(x);
                        y = Math.floor(y);
                        w = Math.floor(w);
                        h = Math.floor(h);

                        // Safety check
                        if (w <= 0 || h <= 0) {
                            // Fallback to strict grid if expansion fails completely (should cover edge cases)
                            x = Math.floor(baseX);
                            y = Math.floor(baseY);
                            w = Math.floor(cellWidth);
                            h = Math.floor(cellHeight);
                            // Minimal clamp for fallback
                            if (x + w > src.cols) w = src.cols - x;
                            if (y + h > src.rows) h = src.rows - y;
                        }

                        const rect = new cv.Rect(x, y, w, h);
                        const cell = src.roi(rect);

                        // Resize to 64x64 to match model training data
                        const resized = new cv.Mat();
                        const dsize = new cv.Size(64, 64);
                        cv.resize(cell, resized, dsize, 0, 0, cv.INTER_LINEAR);

                        cells.push(matToDataUrl(resized));

                        cell.delete();
                        resized.delete();
                    }
                }
                resolve(cells);
            } catch (e) {
                reject(e);
            } finally {
                if (src) src.delete();
            }
        };
        img.onerror = (err) => {
            reject(new Error("Failed to load image for grid extraction."));
        }
    });
};
