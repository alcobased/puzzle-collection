import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { setPositionAndDimensions } from "../../reducers/imageReducer";

const GridImage = () => {
  const { image } = useSelector((state) => state.image);
  const imageRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("image changed");
    const setImage = () => {
      console.log("set position and dimensions");
      if (imageRef.current) {
        const { x, y, width, height } =
          imageRef.current.getBoundingClientRect();
        console.log("imageRef.current", { x, y, width, height });
        dispatch(
          setPositionAndDimensions({
            position: { x, y },
            dimensions: { width, height },
          })
        );
      }
    };
    setImage();
    window.addEventListener("resize", setImage);
    return () => {
      window.removeEventListener("resize", setImage);
    };
  }, [image, dispatch]);

  return (
    <>{image && <img ref={imageRef} src={image} alt="image goes here" />}</>
  );
};

export default GridImage;
