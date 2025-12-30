import { useSelector } from "react-redux";
import useScript from "../../hooks/useScript";
import useClassifier from "../../hooks/useClassifier";

import ImageProcessingHeader from "./ImageProcessingHeader";
import ImageUpload from "./stages/ImageUpload";
import PerspectiveCorrection from "./stages/PerspectiveCorrection";
import Trimming from "./stages/Trimming";
import GridDimensionDetector from "./stages/GridDimensionDetector";
import CellClassifier from "./stages/CellClassifier";

import "./ImageProcessing.css";

const ImageProcessingPage = () => {
  const openCVLoaded = useScript("https://docs.opencv.org/4.5.4/opencv.js");
  const { loading: modelLoading } = useClassifier();
  const stage = useSelector((state) => state.imageProcessing.stage);

  const renderCurrentStage = () => {
    switch (stage) {
      case "load":
        return <ImageUpload />;
      case "perspective":
        return <PerspectiveCorrection />;
      case "trim":
        return <Trimming />;
      case "grid":
        return <GridDimensionDetector />;
      case "classify":
        return <CellClassifier />;
      default:
        return <ImageUpload />;
    }
  };

  return (
    <div className="manual-processing-page">
      <ImageProcessingHeader
        openCVLoaded={openCVLoaded}
        modelLoading={modelLoading}
      />

      {!openCVLoaded ? (
        <div className="loading-message">
          <h3>Loading OpenCV...</h3>
          <p>Please wait a moment for the image processing library to load.</p>
        </div>
      ) : (
        <>
          <div className="stage-container">{renderCurrentStage()}</div>
        </>
      )}
    </div>
  );
};

export default ImageProcessingPage;
