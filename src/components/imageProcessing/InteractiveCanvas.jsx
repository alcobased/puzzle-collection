import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPerspectivePoint,
  addTrimmingPoint,
  toggleCellActive,
} from "../../features/imageProcessing/imageProcessingSlice";

export const InteractiveCanvas = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();

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

    img.src = currentImage;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      drawOverlays(ctx, canvas.width, canvas.height);
    };

    if (img.complete && !img.src.startsWith("data:,")) {
      ctx.drawImage(img, 0, 0);
      drawOverlays(ctx, canvas.width, canvas.height);
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

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ width: "100%", height: "auto" }}
    />
  );
};
