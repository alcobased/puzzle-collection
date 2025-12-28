import { useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const useClassifier = () => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/tfjs_model/model.json");
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load model", err);
      }
    };
    loadModel();
  }, []);

  // Use useCallback so this function can be safely used in other effects
  const predictCanvas = useCallback(
    async (canvasElement) => {
      if (!model) return null;

      return tf.tidy(() => {
        const tensor = tf.browser
          .fromPixels(canvasElement)
          .resizeBilinear([64, 64]) // Bilinear is smoother for grid cells
          .toFloat()
          .expandDims(0);

        const prediction = model.predict(tensor);
        const score = prediction.dataSync()[0];

        // Score < 0.5 = Active based on your training success
        const isActive = score < 0.5;
        const confidence = Math.abs(score - 0.5) * 2 * 100;

        return { isActive, confidence, score };
      });
    },
    [model]
  );

  return { predictCanvas, loading };
};

export default useClassifier;
