import React, { useEffect, useState } from 'react';
import './Bubble.css';

function Bubble({ x, createdAt }) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const bubbleAge = (Date.now() - createdAt) / 1000; // Возраст пузыря в секундах
      setY(bubbleAge * (window.innerHeight / 5)); // Анимация падения
    };

    const interval = setInterval(updatePosition, 50);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="bubble" style={{ left: x, top: y }}></div>
  );

  
}

export default Bubble;
