import { useEffect } from 'react';

const useCollisionCheck = (bubbles, playerPosition, setBubbles, setScore, setExplosions, gameOver, playerWidth, playerHeight, bubbleSize) => {
  useEffect(() => {
    if (!gameOver) {
      const checkCollision = () => {
        const updatedBubbles = bubbles.filter((bubble) => {
          const bubbleAge = (Date.now() - bubble.createdAt) / 1000;
          const bubbleY = bubbleAge * (window.innerHeight / 6) * bubble.speed;

          // Проверка, находится ли пузырь в радиусе 100 пикселей от игрока
          const isWithinInteractionRange =
            bubbleY < window.innerHeight &&
            Math.abs(bubble.x - playerPosition.x) < 100 &&
            Math.abs(bubbleY - playerPosition.y) < 100;

          // Если пузырь не в радиусе взаимодействия, возвращаем его в массив без изменений
          if (!isWithinInteractionRange) return true;

          const playerLeft = playerPosition.x;
          const playerRight = playerPosition.x + playerWidth;
          const playerTop = playerPosition.y;
          const playerBottom = playerPosition.y + playerHeight;

          const bubbleLeft = bubble.x;
          const bubbleRight = bubble.x + bubbleSize;
          const bubbleTop = bubbleY;
          const bubbleBottom = bubbleY + bubbleSize;

          // Проверка на столкновение
          if (
            playerLeft < bubbleRight &&
            playerRight > bubbleLeft &&
            playerTop < bubbleBottom &&
            playerBottom > bubbleTop
          ) {
            // Обработка столкновения
            if (bubble.color === 'blue') {
              setScore((prevScore) => prevScore + 1);
            } else if (bubble.color === 'red') {
              setScore((prevScore) => Math.max(prevScore - 10, 0));
              setExplosions((prevExplosions) => [
                ...prevExplosions,
                { id: bubble.id, x: bubble.x, y: bubbleY },
              ]);
            }
            return false; // Убираем пузырь из массива
          }
          return true; // Оставляем пузырь в массиве
        });
        setBubbles(updatedBubbles);
      };

      // Запускаем проверку столкновений каждые 200 мс
      const collisionInterval = setInterval(checkCollision, 0.5);
      return () => clearInterval(collisionInterval);
    }
  }, [bubbles, playerPosition, setBubbles, setScore, setExplosions, gameOver, playerWidth, playerHeight, bubbleSize]);
};

export default useCollisionCheck;
