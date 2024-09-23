import { useEffect } from 'react';
import { clamp } from './utils';

const usePlayerMovement = (playerWidth, playerHeight, setPlayerPosition) => {
  useEffect(() => {
    let animationFrameId;
    let lastX = 0;
    let lastY = 0;

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const newX = clamp(touch.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(touch.clientY, 0, window.innerHeight - playerHeight);

      if (newX !== lastX || newY !== lastY) {
        lastX = newX;
        lastY = newY;
        
        // Используем requestAnimationFrame для плавности
        animationFrameId = requestAnimationFrame(() => {
          setPlayerPosition({ x: newX, y: newY });
        });
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [playerWidth, playerHeight, setPlayerPosition]);

  useEffect(() => {
    let animationFrameId;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (event) => {
      const newX = clamp(event.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(event.clientY, 0, window.innerHeight - playerHeight);

      if (newX !== lastX || newY !== lastY) {
        lastX = newX;
        lastY = newY;

        // Используем requestAnimationFrame для плавности
        animationFrameId = requestAnimationFrame(() => {
          setPlayerPosition({ x: newX, y: newY });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [playerWidth, playerHeight, setPlayerPosition]);
};

export default usePlayerMovement;
