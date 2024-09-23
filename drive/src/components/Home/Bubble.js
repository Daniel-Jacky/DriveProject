import React, { useEffect, useRef } from 'react';
import './Bubble.css';

function Bubble({ x, createdAt, color, speed }) {
  const bubbleRef = useRef(null);
  const bubbleSpeed = (window.innerHeight / 6) * speed; // Скорость падения

  useEffect(() => {
    let animationFrameId;

    const updatePosition = () => {
      const bubbleAge = (Date.now() - createdAt) / 1000; // Возраст пузыря в секундах
      const newY = Math.min(bubbleAge * bubbleSpeed, window.innerHeight); // Ограничиваем до высоты окна

      if (bubbleRef.current) {
        bubbleRef.current.style.top = `${newY}px`;
      }

      if (newY < window.innerHeight) {
        animationFrameId = requestAnimationFrame(updatePosition); // Запускаем следующий кадр
      }
    };

    updatePosition(); // Начинаем обновление позиции

    return () => {
      cancelAnimationFrame(animationFrameId); // Очищаем кадры при размонтировании
    };
  }, [createdAt, bubbleSpeed]);

  return (
    <div
      ref={bubbleRef}
      className={`bubble ${color}`}
      style={{ left: x, position: 'absolute' }} // Убедитесь, что позиция абсолютная
    ></div>
  );
}

export default Bubble;
