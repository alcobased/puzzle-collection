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

            } catch(e) {
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

export const detectAndOverlayGrid = (imgSrc, bias) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      let src;
      let gray;
      let edges;
      let lines;
      try {
        src = cv.imread(img);
        gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        edges = new cv.Mat();
        cv.Canny(gray, edges, 50, 100, 3, false);
        lines = new cv.Mat();
        cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 80, 100, 10);

        let rowCount = 0;
        let colCount = 0;

        const horizontals = [];
        const verticals = [];

        for (let i = 0; i < lines.rows; ++i) {
            let startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
            let endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
            const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;

            if (angle > -10 && angle < 10) {
                horizontals.push(startPoint.y);
            } else if (angle > 80 && angle < 100 || angle > -100 && angle < -80) {
                verticals.push(startPoint.x);
            }
        }

        horizontals.sort((a,b) => a - b);
        verticals.sort((a,b) => a-b);

        const horizontalGaps = [];
        for(let i = 1; i < horizontals.length; i++) {
            horizontalGaps.push(horizontals[i] - horizontals[i-1]);
        }
        const verticalGaps = [];
        for(let i = 1; i < verticals.length; i++) {
            verticalGaps.push(verticals[i] - verticals[i-1]);
        }

        const averageHorizontalGap = horizontalGaps.reduce((a, b) => a + b, 0) / horizontalGaps.length;
        const averageVerticalGap = verticalGaps.reduce((a, b) => a + b, 0) / verticalGaps.length;

        rowCount = Math.round(src.rows / averageHorizontalGap);
        colCount = Math.round(src.cols / averageVerticalGap);

        const color = new cv.Scalar(255, 0, 0, 255);
        for (let i = 0; i < lines.rows; ++i) {
            let startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
            let endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
            cv.line(src, startPoint, endPoint, color);
        }

        resolve({
          imageWithGrid: matToDataUrl(src),
          rowCount,
          columnCount: colCount
        });

      } catch (e) {
        reject(e);
      } finally {
        if (src) src.delete();
        if (gray) gray.delete();
        if (edges) edges.delete();
        if (lines) lines.delete();
      }
    };
    img.onerror = (err) => {
        reject(new Error("Failed to load image for grid detection."));
    }
  });
};

export const extractGridStructure = (imgSrc, rowCount, colCount, bias) => {
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
            const x = c * cellWidth;
            const y = r * cellHeight;
            const rect = new cv.Rect(x, y, cellWidth, cellHeight);
            const cell = src.roi(rect);
            cells.push(matToDataUrl(cell));
            cell.delete();
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
