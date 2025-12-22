import { useState, useRef, useEffect } from 'react';
import useOpenCV from '../../hooks/useOpenCV';

const AboutPage = () => {
  const openCVReady = useOpenCV();
  const [imageSrc, setImageSrc] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (openCVReady && imageSrc && imageRef.current && canvasRef.current) {
      const cv = window.cv;
      const imgElement = imageRef.current;
      const src = cv.imread(imgElement);
      const dst = new cv.Mat();
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
      cv.imshow(canvasRef.current, dst);
      src.delete();
      dst.delete();
    }
  }, [openCVReady, imageSrc]);

  return (
    <div>
      <h2>About Page</h2>
      <p>
        OpenCV.js Ready: {openCVReady ? 'Yes' : 'No'}
      </p>
      <label className="file-upload-label">
        Load Image
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </label>
      {imageSrc && (
        <div style={{ marginTop: '1rem' }}>
          <div>
            <h3>Original Image</h3>
            <img ref={imageRef} src={imageSrc} alt="upload-preview" style={{ maxWidth: '300px' }} />
          </div>
          <div>
            <h3>OpenCV Grayscale</h3>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;