import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPerspectivePoint,
  addTrimmingPoint,
  toggleCellActive,
} from "../../features/imageProcessing/imageProcessingSlice";

export const InteractiveCanvas = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [mousePos, setMousePos] = useState(null);

  const {
    imageSrc,
    finalImage,
    stage,
    perspectivePoints,
    trimmingPoints,
    rowCount,
    colCount,
    extractedCells,
  } = useSelector((state) => state.imageProcessing);

  const getPointsForStage = () => {
    switch (stage) {
      case "perspective":
        return perspectivePoints;
      case "trim":
        return trimmingPoints;
      default:
        return [];
    }
  };

  const getImageForStage = () => {
    return stage === "perspective" ? imageSrc : finalImage;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const currentImage = getImageForStage();

    const redrawCanvasContents = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      drawOverlays(ctx, canvas.width, canvas.height);
      drawMagnifier(ctx);
    };

    img.src = currentImage;

    if (img.complete && !img.src.startsWith("data:,")) {
      redrawCanvasContents();
    } else {
      img.onload = () => {
        redrawCanvasContents();
      };
    }
  };

  const drawOverlays = (ctx, canvasWidth, canvasHeight) => {
    const points = getPointsForStage();

    // Draw points
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    });

    // Draw lines
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    if (stage === "perspective" && points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (points.length === 4) {
        ctx.closePath();
      }
      ctx.stroke();
    } else if (stage === "trim") {
      points.forEach((point, index) => {
        ctx.beginPath();
        if (index === 0 || index === 2) {
          ctx.moveTo(0, point.y);
          ctx.lineTo(canvasWidth, point.y);
        } else {
          ctx.moveTo(point.x, 0);
          ctx.lineTo(point.x, canvasHeight);
        }
        ctx.stroke();
      });
    } else if (stage === "grid" || stage === "classify") {
      if (rowCount > 0 && colCount > 0) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.beginPath();

        const cellWidth = canvasWidth / colCount;
        const cellHeight = canvasHeight / rowCount;

        for (let i = 1; i < rowCount; i++) {
          const y = i * cellHeight;
          ctx.moveTo(0, y);
          ctx.lineTo(canvasWidth, y);
        }

        for (let i = 1; i < colCount; i++) {
          const x = i * cellWidth;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasHeight);
        }
        ctx.stroke();
      }

      if (stage === "classify") {
        const cellWidth = canvasWidth / colCount;
        const cellHeight = canvasHeight / rowCount;

        Object.values(extractedCells).forEach((cell) => {
          ctx.beginPath();
          ctx.rect(
            cell.x * cellWidth, // Use cell.x
            cell.y * cellHeight, // Use cell.y
            cellWidth,
            cellHeight
          );

          ctx.fillStyle = cell.active
            ? "rgba(0, 255, 0, 0.35)"
            : "rgba(255, 0, 0, 0.15)";

          ctx.fill();
          ctx.stroke();
        });
      }
    }
  };

  const drawMagnifier = (ctx) => {
    if (!mousePos || (stage !== "perspective" && stage !== "trim")) return;

    const radius = 50;
    const magnifierSize = radius * 2;
    const zoomFactor = 2;

    const sourceWidth = magnifierSize / zoomFactor;
    const sourceHeight = magnifierSize / zoomFactor;
    const sourceX = mousePos.x - sourceWidth / 2;
    const sourceY = mousePos.y - sourceHeight / 2;

    const canvas = canvasRef.current;

    // Center of the magnifier circle
    let centerX = mousePos.x;
    let centerY = mousePos.y - radius - 20; // 20px buffer above cursor

    // Adjust if the magnifier goes off the edges
    if (centerY - radius < 0) {
      centerY = mousePos.y + radius + 20;
    }
    if (centerX - radius < 0) {
      centerX = radius;
    }
    if (centerX + radius > canvas.width) {
      centerX = canvas.width - radius;
    }

    // Top-left corner for drawing the magnified image
    const destX = centerX - radius;
    const destY = centerY - radius;

    // 1. Save state
    ctx.save();

    // 2. Create circular clipping path
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);

    // 3. Clip to the path
    ctx.clip();

    // 4. Draw the magnified image
    ctx.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      magnifierSize,
      magnifierSize
    );

    // 5. Restore the canvas state (to remove the clipping path)
    ctx.restore();

    // 6. Draw the circular border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. Draw crosshair in the center
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    // Horizontal line
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    // Vertical line
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();
  };

  useEffect(() => {
    drawCanvas();
  }, [
    imageSrc,
    finalImage,
    stage,
    perspectivePoints,
    trimmingPoints,
    rowCount,
    colCount,
    extractedCells,
    mousePos,
  ]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    switch (stage) {
      case "perspective": {
        dispatch(addPerspectivePoint({ x, y }));
        break;
      }
      case "trim": {
        dispatch(addTrimmingPoint({ x, y }));
        break;
      }
      case "classify": {
        const col = Math.floor((x / canvas.width) * colCount);
        const row = Math.floor((y / canvas.height) * rowCount);
        dispatch(toggleCellActive({ row, col }));
        break;
      }
      default:
        break;
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        height: "auto",
        cursor: stage === "perspective" || stage === "trim" ? "crosshair" : "default",
      }}
    />
  );
};
