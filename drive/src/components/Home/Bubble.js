import React, { useEffect, useState } from 'react';
import './Bubble.css';

function Bubble({ x, createdAt, color, speed }) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const bubbleAge = (Date.now() - createdAt) / 1000; // Возраст пузыря в секундах
      setY(bubbleAge * (window.innerHeight / 6) * speed); // Анимация падения с учетом скорости
    };

    const interval = setInterval(updatePosition, 10);
    return () => clearInterval(interval);
  }, [createdAt, speed]);

  return (
    <div className={`bubble ${color}`} style={{ left: x, top: y }}></div>
  );
}

export default Bubble;
