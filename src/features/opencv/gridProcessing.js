
const findBestCount = (scores, bias) => {
    let maxScore = -1;
    const normalizedScores = {};

    // First pass: calculate all normalized scores and find the absolute max score
    for (const count in scores) {
        const numLines = parseInt(count) - 1;
        if (numLines <= 0) {
            normalizedScores[count] = 0;
            continue;
        };

        const normalizedScore = scores[count] / numLines;
        normalizedScores[count] = normalizedScore;

        if (normalizedScore > maxScore) {
            maxScore = normalizedScore;
        }
    }

    // Second pass: find the highest count among those with a top-tier score
    let bestCount = 0;
    // Use the bias parameter to determine the threshold
    const scoreThreshold = maxScore * bias;

    for (const count in normalizedScores) {
        if (normalizedScores[count] >= scoreThreshold) {
            if (parseInt(count) > bestCount) {
                bestCount = parseInt(count);
            }
        }
    }

    return bestCount;
};


// This function will be called from the ManualProcessingPage.
// It takes an image data URL and a bias as input.
export const detectAndOverlayGrid = (imageDataUrl, bias) => {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => {
            try {
                const width = image.width;
                const height = image.height;

                if (!width || !height) {
                    console.error("Image loaded but has zero dimensions.");
                    resolve({ imageWithGrid: imageDataUrl, rowCount: 0, columnCount: 0 });
                    return;
                }

                const mat = cv.imread(image);
                const gray = new cv.Mat();
                cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);

                const thresh = new cv.Mat();
                cv.adaptiveThreshold(gray, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

                const horizontalScores = {};
                const verticalScores = {};
                const lineWidth = 3;

                const MIN_LINES = 1;
                const MAX_LINES = 30;

                // Score horizontal lines
                for (let rows = MIN_LINES + 1; rows <= MAX_LINES + 1; rows++) {
                    let currentScore = 0;
                    const cellHeight = height / rows;
                    for (let i = 1; i < rows; i++) {
                        const y = Math.round(i * cellHeight);
                        const startY = Math.max(0, y - Math.floor(lineWidth / 2));
                        const roiHeight = Math.min(lineWidth, height - startY);
                        if (roiHeight <= 0) continue;

                        const roiRect = new cv.Rect(0, startY, width, roiHeight);
                        const roi = thresh.roi(roiRect);
                        currentScore += cv.countNonZero(roi);
                        roi.delete();
                    }
                    horizontalScores[rows] = currentScore;
                }

                // Score vertical lines
                for (let cols = MIN_LINES + 1; cols <= MAX_LINES + 1; cols++) {
                    let currentScore = 0;
                    const cellWidth = width / cols;
                    for (let i = 1; i < cols; i++) {
                        const x = Math.round(i * cellWidth);
                        const startX = Math.max(0, x - Math.floor(lineWidth / 2));
                        const roiWidth = Math.min(lineWidth, width - startX);
                        if (roiWidth <= 0) continue;

                        const roiRect = new cv.Rect(startX, 0, roiWidth, height);
                        const roi = thresh.roi(roiRect);
                        currentScore += cv.countNonZero(roi);
                        roi.delete();
                    }
                    verticalScores[cols] = currentScore;
                }

                const rowCount = findBestCount(horizontalScores, bias);
                const columnCount = findBestCount(verticalScores, bias);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0);

                if (rowCount > 0 && columnCount > 0) {
                    ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                    ctx.lineWidth = 2;

                    const finalCellWidth = width / columnCount;
                    const finalCellHeight = height / rowCount;

                    for (let i = 1; i < columnCount; i++) {
                        const x = i * finalCellWidth;
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, height);
                        ctx.stroke();
                    }

                    for (let i = 1; i < rowCount; i++) {
                        const y = i * finalCellHeight;
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(width, y);
                        ctx.stroke();
                    }
                }

                const imageWithGrid = canvas.toDataURL('image/jpeg');

                mat.delete();
                gray.delete();
                thresh.delete();

                resolve({ imageWithGrid, rowCount, columnCount });

            } catch (error) {
                console.error("OpenCV processing failed:", error);
                resolve({ imageWithGrid: imageDataUrl, rowCount: 0, columnCount: 0 });
            }
        };

        image.onerror = (err) => {
            console.error("Image loading failed:", err);
            resolve({ imageWithGrid: imageDataUrl, rowCount: 0, columnCount: 0 });
        }

        image.src = imageDataUrl;
    });
};

export const overlayGrid = (imageDataUrl, rowCount, columnCount) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            if (rowCount > 0 && columnCount > 0) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                ctx.lineWidth = 2;

                const finalCellWidth = image.width / columnCount;
                const finalCellHeight = image.height / rowCount;

                for (let i = 1; i < columnCount; i++) {
                    const x = i * finalCellWidth;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, image.height);
                    ctx.stroke();
                }

                for (let i = 1; i < rowCount; i++) {
                    const y = i * finalCellHeight;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(image.width, y);
                    ctx.stroke();
                }
            }
            resolve(canvas.toDataURL('image/jpeg'));
        };
        image.src = imageDataUrl;
    });
};


// Placeholder for the final extraction step
// Helper to calculate Otsu's threshold for a 1D array of values (0-255)
const getOtsuThreshold = (values) => {
    const histogram = new Array(256).fill(0);
    values.forEach(v => histogram[Math.floor(v)]++);

    const total = values.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVar = 0;
    let threshold = 0;

    for (let i = 0; i < 256; i++) {
        wB += histogram[i];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;

        sumB += i * histogram[i];
        const mB = sumB / wB;
        const mF = (sum - sumB) / wF;

        const varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > maxVar) {
            maxVar = varBetween;
            threshold = i;
        }
    }
    return threshold;
};

export const extractGridStructure = (imageDataUrl, rowCount, columnCount) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const mat = cv.imread(img);
                const gray = new cv.Mat();
                cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);

                const cellStats = [];
                const cellWidth = mat.cols / columnCount;
                const cellHeight = mat.rows / rowCount;

                // 1. Collect stats for every cell
                for (let r = 0; r < rowCount; r++) {
                    for (let c = 0; c < columnCount; c++) {
                        // Sample the center 50% of the cell to avoid grid lines/borders
                        const x = Math.floor((c + 0.25) * cellWidth);
                        const y = Math.floor((r + 0.25) * cellHeight);
                        const w = Math.floor(0.5 * cellWidth);
                        const h = Math.floor(0.5 * cellHeight);

                        // Ensure ROI is within bounds
                        if (x < 0 || y < 0 || x + w > mat.cols || y + h > mat.rows) {
                            cellStats.push({ r, c, mean: 0 });
                            continue;
                        }

                        const rect = new cv.Rect(x, y, w, h);
                        const roi = gray.roi(rect);
                        const mean = cv.mean(roi)[0];

                        cellStats.push({ r, c, mean });
                        roi.delete();
                    }
                }

                // 2. Determine Threshold
                const means = cellStats.map(s => s.mean);
                const threshold = getOtsuThreshold(means);

                // 3. Classify Cells
                // We assume the board is lighter than the background (higher pixel value)
                // If the board is dark on light, this logic might need inversion or a UI toggle.
                // A simple heuristic: check the corners. If corners are dark, board is light.

                // Let's check the average of the 4 corners to guess the background color
                const corners = [
                    cellStats.find(s => s.r === 0 && s.c === 0),
                    cellStats.find(s => s.r === 0 && s.c === columnCount - 1),
                    cellStats.find(s => s.r === rowCount - 1 && s.c === 0),
                    cellStats.find(s => s.r === rowCount - 1 && s.c === columnCount - 1)
                ];
                const avgCornerBrightness = corners.reduce((acc, curr) => acc + (curr ? curr.mean : 0), 0) / 4;

                const isBoardLighter = avgCornerBrightness < threshold;

                const cells = cellStats.map(stat => ({
                    row: stat.r,
                    col: stat.c,
                    active: isBoardLighter ? (stat.mean > threshold) : (stat.mean < threshold),
                    mean: stat.mean
                }));

                mat.delete();
                gray.delete();

                console.log(`Grid Extraction: Threshold=${threshold}, BoardLighter=${isBoardLighter}`);
                resolve({ cells, threshold, isBoardLighter });

            } catch (e) {
                console.error("Error extracting grid structure:", e);
                reject(e);
            }
        };
        img.onerror = reject;
        img.src = imageDataUrl;
    });
};
