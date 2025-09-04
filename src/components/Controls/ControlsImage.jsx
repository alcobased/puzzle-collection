import { useDispatch } from "react-redux";
import { setImage, clearImage } from "../../reducers/imageReducer";

const ControlsImage = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h2>ControlsImage</h2>
      <input
        type="file"
        name="imgLoader"
        id="imgLoader"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            dispatch(setImage(reader.result));
          };
          reader.readAsDataURL(file);
        }}
      />
      <button onClick={() => dispatch(clearImage())}>Clear</button>
    </div>
  );
};

export default ControlsImage;
