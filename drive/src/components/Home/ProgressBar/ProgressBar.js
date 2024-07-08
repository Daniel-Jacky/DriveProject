// ProgressBar.js
import React, { useState, useEffect } from 'react';
import './ProgressBar.css'; // Файл стилей для прогресс-бара

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 60) {
          clearInterval(interval); 
          setTimeout(() => {
            setProgress(0); 
            startProgress(); 
          }, 1000);
          return 0;
        }
        return prevProgress + 1;
      });
    }, 1000); 

    return () => {
      clearInterval(interval); 
    };
  }, []); 

  const startProgress = () => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 60) {
          clearInterval(interval); 
          setTimeout(() => {
            setProgress(0); 
            startProgress(); 
          }, 1000);
          return 0;
        }
        return prevProgress + 1;
      });
    }, 1000);
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
