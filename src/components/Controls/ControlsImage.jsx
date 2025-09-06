import { useDispatch } from "react-redux";
import { setSrc, unloadImage } from "../../reducers/imageReducer";

const ControlsImage = () => {
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          dispatch(
            setSrc({
              src: event.target.result,
              dimensions: {
                width: img.width,
                height: img.height,
              },
            })
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUnloadImage = () => {
    dispatch(unloadImage());
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleUnloadImage}>Unload Image</button>
    </div>
  );
};

export default ControlsImage;
