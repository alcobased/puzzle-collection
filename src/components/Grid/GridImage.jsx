import { useSelector } from "react-redux";

const GridImage = () => {
  const src = useSelector((state) => state.image.src);

  if (!src) {
    return null;
  }

  return <img id="image" src={src} alt="grid background" />;
};

export default GridImage;
