import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRendered } from "../../../features/image/imageSlice.js";
import PuzzleImage from "../../common/PuzzleImage.jsx";
import './PuzzleViewport.css';

const PuzzleViewport = (props) => {
  const viewportRef = useRef(null);
  const dispatch = useDispatch();
  const { src, naturalDimensions, rendered } = useSelector((state) => state.image);

  const measureAndDispatch = useCallback(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    if (src && naturalDimensions.width > 0) {
      const containerWidth = viewportElement.offsetWidth;
      const containerHeight = viewportElement.offsetHeight;
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
          width: viewportElement.offsetWidth,
          height: viewportElement.offsetHeight,
          top: 0,
          left: 0,
        })
      );
    }
  }, [src, naturalDimensions, dispatch]);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const observer = new ResizeObserver(measureAndDispatch);
    observer.observe(viewportElement);

    measureAndDispatch();

    return () => {
      observer.unobserve(viewportElement);
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

  const viewportStyle = {
    "--rendered-width": `${rendered.width}px`,
    "--rendered-height": `${rendered.height}px`,
    "--rendered-top": `${rendered.top}px`,
    "--rendered-left": `${rendered.left}px`,
  };

  return (
    <div id="viewport" ref={viewportRef} style={viewportStyle}>
      {props.children}
      <PuzzleImage />
    </div>
  );
};

export default PuzzleViewport;
