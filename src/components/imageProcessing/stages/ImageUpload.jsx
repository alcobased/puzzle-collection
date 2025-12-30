import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setImageSrc,
  setFinalImage,
  setSkipPreprocessing,
  setStage,
} from "../../../features/imageProcessing/imageProcessingSlice";
import { AppConfig } from "../../../config";

const ImageUpload = () => {
  const dispatch = useDispatch();
  const skipPreprocessing = useSelector(
    (state) => state.imageProcessing.skipPreprocessing
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (skipPreprocessing) {
          dispatch(setFinalImage(e.target.result));
          dispatch(setStage("grid"));
        } else {
          dispatch(setImageSrc(e.target.result));
          dispatch(setStage("perspective"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkipChange = (e) => {
    dispatch(setSkipPreprocessing(e.target.checked));
  };

  return (
    <div className="upload-section">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={skipPreprocessing}
          onChange={handleSkipChange}
        />
        Skip Preprocessing
      </label>
      <input type="file" onChange={handleImageChange} accept="image/*" />
    </div>
  );
};

export default ImageUpload;
