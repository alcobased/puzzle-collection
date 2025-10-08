import { useSelector } from "react-redux";

const PuzzleImage = () => {
  const src = useSelector((state) => state.image.src);

  if (!src) {
    return null;
  }

  return <img id="image" src={src} alt="puzzle background" />;
};

export default PuzzleImage;
