
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


// Placeholder for the final extraction step
export const extractGridStructure = (imageDataUrl, rowCount, columnCount) => {
    console.log("Extracting final grid structure with:", { rowCount, columnCount });
    return Promise.resolve({ cells: [] });
};
