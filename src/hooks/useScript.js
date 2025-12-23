import { useState, useEffect } from 'react';

const useScript = (src) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    // No cleanup function to remove the script
  }, [src]);

  return loaded;
};

export default useScript;
