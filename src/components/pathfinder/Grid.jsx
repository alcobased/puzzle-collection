import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRendered } from "../../features/image/imageSlice.js";
import GridCells from "./GridCells";
import GridImage from "../image/GridImage";
import GridLines from "./GridLines";
import './Grid.css';

const Grid = () => {
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const { src, naturalDimensions, rendered } = useSelector((state) => state.image);

  const measureAndDispatch = useCallback(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    if (src && naturalDimensions.width > 0) {
      const containerWidth = gridElement.offsetWidth;
      const containerHeight = gridElement.offsetHeight;
      const { width: naturalWidth, height: naturalHeight } = naturalDimensions;

      const containerRatio = containerWidth / containerHeight;
      const imageRatio = naturalWidth / naturalHeight;

      let renderedWidth, renderedHeight, renderedTop, renderedLeft;

      if (imageRatio > containerRatio) {
        renderedWidth = containerWidth;
        renderedHeight = renderedWidth / imageRatio;
        renderedTop = (containerHeight - renderedHeight) / 2;
        renderedLeft = 0;
      } else {
        renderedHeight = containerHeight;
        renderedWidth = renderedHeight * imageRatio;
        renderedLeft = (containerWidth - renderedWidth) / 2;
        renderedTop = 0;
      }

      dispatch(
        setRendered({
          width: renderedWidth,
          height: renderedHeight,
          top: renderedTop,
          left: renderedLeft,
        })
      );
    } else if (!src) {
      dispatch(
        setRendered({
          width: gridElement.offsetWidth,
          height: gridElement.offsetHeight,
          top: 0,
          left: 0,
        })
      );
    }
  }, [src, naturalDimensions, dispatch]);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const observer = new ResizeObserver(measureAndDispatch);
    observer.observe(gridElement);

    measureAndDispatch();

    return () => {
      observer.unobserve(gridElement);
    };
  }, [measureAndDispatch]);

  useEffect(() => {
    const imgElement = document.getElementById("image");
    if (!imgElement) return;

    if (imgElement.complete) {
      measureAndDispatch();
    } else {
      imgElement.addEventListener("load", measureAndDispatch);
    }

    return () => {
      imgElement.removeEventListener("load", measureAndDispatch);
    };
  }, [src, measureAndDispatch]);

  const gridStyle = {
    "--rendered-width": `${rendered.width}px`,
    "--rendered-height": `${rendered.height}px`,
    "--rendered-top": `${rendered.top}px`,
    "--rendered-left": `${rendered.left}px`,
  };

  return (
    <div id="grid" ref={gridRef} style={gridStyle}>
      <GridLines />
      <GridImage />
      <GridCells />
    </div>
  );
};

export default Grid;
