import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRendered } from "../../features/image/imageSlice.js";
import GridCells from "./GridCells";
import GridImage from "../image/GridImage";
import GridLine from "./GridLine"; // Import the new component
import './Grid.css';

const Grid = () => {
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const { src, naturalDimensions, rendered } = useSelector((state) => state.image);
  const { cellSet, queueSet, activeQueue } = useSelector((state) => state.puzzles.pathfinder.cells);

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

  const lines = [];
  const currentQueue = queueSet[activeQueue] || [];

  if (currentQueue.length > 1 && rendered.width && rendered.height) {
    for (let i = 0; i < currentQueue.length - 1; i++) {
      const fromCellId = currentQueue[i];
      const toCellId = currentQueue[i + 1];

      const fromCell = cellSet[fromCellId];
      const toCell = cellSet[toCellId];

      if (fromCell && toCell) {
        const from = {
          x: fromCell.normalizedPosition.x * rendered.width,
          y: fromCell.normalizedPosition.y * rendered.height,
        };
        const to = {
          x: toCell.normalizedPosition.x * rendered.width,
          y: toCell.normalizedPosition.y * rendered.height,
        };
        lines.push({ from, to, id: `${fromCellId}-${toCellId}` });
      }
    }
  }

  const gridStyle = {
    "--rendered-width": `${rendered.width}px`,
    "--rendered-height": `${rendered.height}px`,
    "--rendered-top": `${rendered.top}px`,
    "--rendered-left": `${rendered.left}px`,
  };

  return (
    <div id="grid" ref={gridRef} style={gridStyle}>
      <svg className="grid-lines">
        {lines.map((line) => (
          <GridLine key={line.id} from={line.from} to={line.to} />
        ))}
      </svg>
      <GridImage />
      <GridCells />
    </div>
  );
};

export default Grid;
