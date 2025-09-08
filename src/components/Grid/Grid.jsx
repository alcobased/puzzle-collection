import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRendered } from "../../reducers/imageReducer";
import GridCells from "./GridCells";
import GridImage from "./GridImage";
import './Grid.css';

const Grid = () => {
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const { src, naturalDimensions } = useSelector((state) => state.image);

  const measureAndDispatch = useCallback(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    if (src && naturalDimensions.width > 0) {
      // If image exists and we have its dimensions, calculate its rendered size
      const containerWidth = gridElement.offsetWidth;
      const containerHeight = gridElement.offsetHeight;
      const { width: naturalWidth, height: naturalHeight } = naturalDimensions;

      const containerRatio = containerWidth / containerHeight;
      const imageRatio = naturalWidth / naturalHeight;

      let renderedWidth, renderedHeight, renderedTop, renderedLeft;

      if (imageRatio > containerRatio) {
        // Image is wider than container aspect ratio, constrained by width
        renderedWidth = containerWidth;
        renderedHeight = renderedWidth / imageRatio;
        renderedTop = (containerHeight - renderedHeight) / 2;
        renderedLeft = 0;
      } else {
        // Image is taller or same aspect ratio, constrained by height
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
      // If no image src, measure the grid container to fill the space
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

  // Set up a ResizeObserver to automatically measure when the grid size changes.
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const observer = new ResizeObserver(measureAndDispatch);
    observer.observe(gridElement);

    measureAndDispatch(); // Initial measurement

    return () => {
      observer.unobserve(gridElement);
    };
  }, [measureAndDispatch]);

  // Set up an event listener to measure the image once it has loaded.
  useEffect(() => {
    const imgElement = document.getElementById("image");
    if (!imgElement) return;

    // The image might already be loaded (e.g., from cache)
    if (imgElement.complete) {
      measureAndDispatch();
    } else {
      imgElement.addEventListener("load", measureAndDispatch);
    }

    return () => {
      imgElement.removeEventListener("load", measureAndDispatch);
    };
  }, [src, measureAndDispatch]);

  return (
    <div id="grid" ref={gridRef}>
      <GridImage />
      <GridCells />
    </div>
  );
};

export default Grid;
