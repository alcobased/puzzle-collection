import { useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRendered } from "../../features/image/imageSlice";

const PuzzleImage = () => {
  const src = useSelector((state) => state.image.src);
  const isControlsVisible = useSelector((state) => state.ui.isControlsVisible);
  const imgRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageChange = useCallback(() => {
    if (imgRef.current) {
      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } =
        imgRef.current;
      dispatch(
        setRendered({ offsetWidth, offsetHeight, offsetTop, offsetLeft })
      );
    }
  }, [dispatch]);

  // Effect for debounced window resize
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleImageChange();
      }, 200); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [handleImageChange]);

  // Effect for controls visibility toggle
  useEffect(() => {
    // When the control panel's visibility changes, the image's dimensions might change.
    // We wait for a short period to allow for CSS transitions to complete before recalculating.
    const timeoutId = setTimeout(() => {
        handleImageChange();
    }, 250); 

    return () => clearTimeout(timeoutId);
  }, [isControlsVisible, handleImageChange]);


  return (
    <img
      id="image"
      src={src}
      alt="puzzle background"
      ref={imgRef}
      onLoad={handleImageChange}
    />
  );
};

export default PuzzleImage;
