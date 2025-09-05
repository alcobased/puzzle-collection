import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { setPositionAndDimensions } from "../../reducers/imageReducer";
import { addCell } from "../../reducers/cellReducer"

const GridImage = () => {
  const { data, position, dimensions } = useSelector((state) => state.image);
  const imageRef = useRef(null);

  const dispatch = useDispatch();

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { x, y, width, height } = imageRef.current.getBoundingClientRect();
      dispatch(
        setPositionAndDimensions({ x, y, width, height })
      );
    }
  };

  const handleImageClick = (e) => {
    const relativeX = e.clientX - position.x;
    const relativeY = e.clientY - position.y;

    const normalizedX = relativeX / dimensions.width;
    const normalizedY = relativeY / dimensions.height;

    const id = crypto.randomUUID();
    dispatch(addCell({ id: id, normalizedPosition: { x: normalizedX, y: normalizedY } }))
  };

  useEffect(() => {
    // We only need to listen for resizes after the image has loaded.
    // The handleImageLoad function handles the initial setup.
    const setImageOnResize = () => {
      if (imageRef.current) {
        const { x, y, width, height } = imageRef.current.getBoundingClientRect();
        dispatch(
          setPositionAndDimensions({ x, y, width, height })
        );
      }
    };
    window.addEventListener("resize", setImageOnResize);
    return () => {
      window.removeEventListener("resize", setImageOnResize);
    };
  }, [dispatch]); // Removed 'data' from dependency array to avoid redundant listeners

  return (
    <>{data && <img ref={imageRef} src={data} alt="image goes here" onLoad={handleImageLoad} onClick={handleImageClick} />}</>
  );
};

export default GridImage;