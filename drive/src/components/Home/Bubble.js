import React, { useEffect, useRef } from 'react';
import './Bubble.css';

function Bubble({ x, createdAt, color, speed, onRemove }) {
  const bubbleRef = useRef(null);
  const bubbleSpeed = useRef((window.innerHeight / 6) * speed);

  useEffect(() => {
    let animationFrameId;

    const updatePosition = () => {
      const bubbleAge = (Date.now() - createdAt) / 1000; // Возраст пузыря в секундах
      const newY = Math.min(bubbleAge * bubbleSpeed.current, window.innerHeight); // Ограничиваем до высоты окна

      if (bubbleRef.current) {
        bubbleRef.current.style.transform = `translateY(${newY}px)`;
      }

      // Если пузырь достигает нижней границы экрана, удаляем его
      if (newY >= window.innerHeight) {
        if (onRemove) onRemove();
      } else {
        animationFrameId = requestAnimationFrame(updatePosition);
      }
    };

    updatePosition(); // Начинаем обновление позиции

    return () => {
      cancelAnimationFrame(animationFrameId); // Очищаем кадры при размонтировании
    };
  }, [createdAt, onRemove]);

  return (
    <div
      ref={bubbleRef}
      className={`bubble ${color}`}
      style={{
        left: x,
        position: 'absolute',
        top: 0, // Убедитесь, что мы начинаем с верхней части экрана
      }}
    ></div>
  );
}

export default Bubble;
