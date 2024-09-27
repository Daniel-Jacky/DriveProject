// src/usePlayerMovement.js
import { useEffect } from 'react';
import { clamp } from './utils';

const usePlayerMovement = (playerWidth, playerHeight, setPlayerPosition) => {
  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const newX = clamp(touch.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(touch.clientY, 0, window.innerHeight - playerHeight);
      setPlayerPosition({ x: newX, y: newY });
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [playerWidth, playerHeight, setPlayerPosition]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      event.preventDefault();
      const newX = clamp(event.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(event.clientY, 0, window.innerHeight - playerHeight);
      setPlayerPosition({ x: newX, y: newY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [playerWidth, playerHeight, setPlayerPosition]);
};

export default usePlayerMovement;
