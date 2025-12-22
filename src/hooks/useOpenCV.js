import { useState, useEffect } from "react";

const useOpenCV = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. If already loaded in the global window object, update state and exit
    if (window.cv && window.cv.onRuntimeInitialized) {
      setReady(true);
      return;
    }

    // 2. Set up the global Module object BEFORE the script loads/executes
    // This is how OpenCV signals it is ready to use.
    if (!window.Module) {
      window.Module = {
        onRuntimeInitialized: () => {
          setReady(true);
        },
      };
    }

    // 3. Check if script is already in the document
    const existingScript = document.getElementById("opencv-cdn");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "opencv-cdn";
      script.src = "https://docs.opencv.org/4.x/opencv.js";
      script.async = true;

      // Safety: in case the CDN fails
      script.onerror = () => {
        console.error("Failed to load OpenCV.js from CDN");
      };

      document.body.appendChild(script);
    } else if (window.cv) {
      // If script exists but ready wasn't set, check if cv is already initialized
      setReady(true);
    }
  }, []);

  return ready;
};

export default useOpenCV;
