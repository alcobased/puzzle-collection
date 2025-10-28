import { useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRendered } from "../../features/image/imageSlice";

const PuzzleImage = () => {
  const src = useSelector((state) => state.image.src);
  const imgRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageLoad = useCallback((e) => {
    console.log("Image loaded");
    if (imgRef.current) {
      const { offsetWidth, offsetHeight, offsetTop, offsetLeft } =
        imgRef.current;
      dispatch(
        setRendered({ offsetWidth, offsetHeight, offsetTop, offsetLeft })
      );
    }
  }, []);

  return (
    <img
      id="image"
      src={src}
      alt="puzzle background"
      ref={imgRef}
      onLoad={handleImageLoad}
    />
  );
};

export default PuzzleImage;
