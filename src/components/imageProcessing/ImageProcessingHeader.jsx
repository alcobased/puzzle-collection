import React from 'react';
import ImageProcessingStageSelector from './ImageProcessingStageSelector';

const ImageProcessingHeader = ({ openCVLoaded, modelLoading }) => {
  return (
    <div className='image-processing-header'>
      <div className="header-row">
        <h2>Image Processor</h2>
        <div className="status-indicators">
          <p>
            OpenCV: {openCVLoaded ? '🟢' : '🔴'} | AI:{' '}
            {modelLoading ? '⏳' : '🟢'}
          </p>
        </div>
      </div>
      <ImageProcessingStageSelector />
    </div>
  );
};

export default ImageProcessingHeader;
