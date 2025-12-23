import { useState, useRef, useEffect } from "react";
import useOpenCV from "../../hooks/useOpenCV";

const AboutPage = () => {
  const openCVReady = useOpenCV();
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);

  // Visualization Refs
  const grayCanvasRef = useRef(null);
  const threshCanvasRef = useRef(null);
  const linesCanvasRef = useRef(null);
  const finalCanvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (openCVReady && imageSrc) {
      const imgElement = imageRef.current;

      const runPipeline = () => {
        const cv = window.cv;
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
          // Median blur helps remove the "salt and pepper" noise of the paper texture
          cv.medianBlur(gray, gray, 5);
          cv.imshow(grayCanvasRef.current, gray);

          // STAGE 2: High-Threshold Adaptive Binarization
          // Constant of 20 helps ignore light gray text and shadows
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
          // These steps effectively "erase" the numbers by looking only for long lines
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

          // Combine Horizontal and Vertical lines to get the board "Skeleton"
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
            // Filter to only consider large connected components (the grid)
            if (rect.width > 100 && rect.height > 100) {
              minX = Math.min(minX, rect.x);
              minY = Math.min(minY, rect.y);
              maxX = Math.max(maxX, rect.x + rect.width);
              maxY = Math.max(maxY, rect.y + rect.height);
            }
          }

          // Show the result of the line detection logic on stage 3 canvas
          cv.imshow(linesCanvasRef.current, gridSkeleton);

          // STAGE 5: Final Crop and Resize
          if (maxX > minX) {
            let roiRect = new cv.Rect(minX, minY, maxX - minX, maxY - minY);
            let cropped = src.roi(roiRect);
            let final = new cv.Mat();
            // Resizing to 800x800 allows for easy 15x15 cell mapping later
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

      if (imgElement.complete) runPipeline();
      else imgElement.onload = runPipeline;
    }
  }, [openCVReady, imageSrc]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        backgroundColor: "#444",
      }}
    >
      <h2>Codeword Board Shape Detector</h2>
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#555",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p>OpenCV Status: {openCVReady ? "🟢 Ready" : "🔴 Loading..."}</p>
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>

      <img
        ref={imageRef}
        src={imageSrc}
        alt="source"
        style={{ display: "none" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
        }}
      >
        <section>
          <h4>1. Grayscale & Blur</h4>
          <canvas ref={grayCanvasRef} style={canvasStyle} />
        </section>
        <section>
          <h4>2. Extracted Skeleton</h4>
          <canvas ref={threshCanvasRef} style={canvasStyle} />
        </section>
        <section>
          <h4>3. Verified Grid Lines</h4>
          <canvas ref={linesCanvasRef} style={canvasStyle} />
        </section>
        <section>
          <h4>4. Final Normalized Board</h4>
          <canvas
            ref={finalCanvasRef}
            style={{ ...canvasStyle, border: "2px solid #007bff" }}
          />
        </section>
      </div>
    </div>
  );
};

const canvasStyle = {
  width: "100%",
  height: "auto",
  backgroundColor: "#333",
  borderRadius: "4px",
};

export default AboutPage;
