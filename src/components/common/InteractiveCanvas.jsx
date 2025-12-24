import React, { useEffect, forwardRef } from "react";

export const InteractiveCanvas = forwardRef(({ imageSrc, points, onCanvasClick, onImageLoaded, imgRef, onMouseMove, onMouseLeave, stage }, ref) => {

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    if(imgRef) imgRef.current = img;
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Draw points
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });

      // Draw lines based on the stage
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      switch (stage) {
        case 'perspective':
          if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            if (points.length === 4) {
              ctx.closePath();
            }
            ctx.stroke();
          }
          break;
        case 'trimming':
          points.forEach((point, index) => {
            ctx.beginPath();
            if (index === 0 || index === 2) { // Top and Bottom
              ctx.moveTo(0, point.y);
              ctx.lineTo(canvas.width, point.y);
            } else { // Left and Right
              ctx.moveTo(point.x, 0);
              ctx.lineTo(point.x, canvas.height);
            }
            ctx.stroke();
          });
          break;
        default:
          break;
      }

      if(onImageLoaded) onImageLoaded({width: img.naturalWidth, height: img.naturalHeight});
    };
  }, [imageSrc, points, onImageLoaded, imgRef, ref, stage]);

  return <canvas ref={ref} onClick={onCanvasClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />;
});