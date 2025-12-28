import React from 'react';

const ImageUpload = ({ handleImageChange, skipPreprocessing, setSkipPreprocessing }) => {
  return (
    <div className="upload-section">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={skipPreprocessing}
          onChange={(e) => setSkipPreprocessing(e.target.checked)}
        />
        Skip Preprocessing
      </label>
      <input type="file" onChange={handleImageChange} accept="image/*" />
    </div>
  );
};

export default ImageUpload;
