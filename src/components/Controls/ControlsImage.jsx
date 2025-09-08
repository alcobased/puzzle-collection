import { useDispatch } from "react-redux";
import { setSrc, unloadImage } from "../../reducers/imageReducer";

const ControlsImage = () => {
  const dispatch = useDispatch();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          dispatch(
            setSrc({
              src: e.target.result,
              dimensions: {
                width: img.width,
                height: img.height,
              },
            })
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUnloadImage = () => {
    dispatch(unloadImage());
  };

  return (
    <fieldset>
      <legend>Image</legend>
      <label className="file-upload-label">
        Load Image
        <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
        />
      </label>
      <button onClick={handleUnloadImage}>Unload Image</button>
    </fieldset>
  );
};

export default ControlsImage;
