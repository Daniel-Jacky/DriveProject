import React, { useState, useEffect } from 'react';
import Bubble from './Bubble';
import PlayerBubble from './PlayerBubble';
import './Game.css';

function Game() {
  const [bubbles, setBubbles] = useState([]);
  const [explosions, setExplosions] = useState([]); // Новый стейт для управления взрывами
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(730);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [gameOver, setGameOver] = useState(false);

  const playerWidth = 10; // Ширина машины
  const playerHeight = 50; // Высота машины
  const bubbleSize = 40; // Размер пузыря (ширина и высота)

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // Предотвращение стандартного поведения
      const touch = event.touches[0];
      const newX = clamp(touch.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(touch.clientY, 0, window.innerHeight - playerHeight);
      setPlayerPosition({ x: newX, y: newY });
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false }); // Установка passive: false

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      event.preventDefault(); // Предотвращение стандартного поведения
      const newX = clamp(event.clientX, 0, window.innerWidth - playerWidth);
      const newY = clamp(event.clientY, 0, window.innerHeight - playerHeight);
      setPlayerPosition({ x: newX, y: newY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      const bubbleInterval = setInterval(() => {
        const newBubble = {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - bubbleSize),
          color: Math.random() < 0.15 ? 'red' : 'blue', // 15% шанс на красный пузырь, 85% на голубой
          createdAt: Date.now(),
        };
        setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
      }, 500);
      return () => clearInterval(bubbleInterval);
    }
  }, [timeLeft]);

  useEffect(() => {
    const checkCollision = () => {
      const updatedBubbles = bubbles.filter((bubble) => {
        const bubbleAge = (Date.now() - bubble.createdAt) / 1000; // Возраст пузыря в секундах
        const bubbleY = bubbleAge * (window.innerHeight / 5); // Анимация падения

        const playerLeft = playerPosition.x;
        const playerRight = playerPosition.x + playerWidth;
        const playerTop = playerPosition.y;
        const playerBottom = playerPosition.y + playerHeight;

        const bubbleLeft = bubble.x;
        const bubbleRight = bubble.x + bubbleSize;
        const bubbleTop = bubbleY;
        const bubbleBottom = bubbleY + bubbleSize;

        // Проверка пересечения прямоугольников
        if (
          playerLeft < bubbleRight &&
          playerRight > bubbleLeft &&
          playerTop < bubbleBottom &&
          playerBottom > bubbleTop
        ) {
          if (bubble.color === 'blue') {
            setScore((prevScore) => prevScore + 1);
          } else if (bubble.color === 'red') {
            setScore((prevScore) => Math.max(prevScore - 30, 0));
            // Добавляем взрыв
            setExplosions((prevExplosions) => [
              ...prevExplosions,
              { id: bubble.id, x: bubble.x, y: bubbleY },
            ]);
          }
          return false; // Удаляем пузырь из массива при столкновении
        }
        return true;
      });
      setBubbles(updatedBubbles);
    };

    const collisionInterval = setInterval(checkCollision, 0.2);
    return () => clearInterval(collisionInterval);
  }, [bubbles, playerPosition]);

  return (
    <div className="game">
      {!gameOver ? (
        <>
          <div className='gameTimeAndScore'>
            <div className='timeLeft'>
              <h2>{timeLeft}</h2>
            </div>
            <div>
              <h2>{score}</h2>
            </div>
          </div>
          <PlayerBubble x={playerPosition.x} y={playerPosition.y} />
          {bubbles.map((bubble) => (
            <Bubble key={bubble.id} x={bubble.x} createdAt={bubble.createdAt} color={bubble.color} />
          ))}
          {explosions.map((explosion) => (
            <div key={explosion.id} className="explosion" style={{ left: explosion.x, top: explosion.y }}></div>
          ))}
        </>
      ) : (
        <div className="game-over">
          <h1>Игра окончена!</h1>
          <h2>Ваш счет: {score}</h2>
          <button onClick={() => window.location.href = '/'}>Назад на главный экран</button>
        </div>
      )}
    </div>
  );
}

export default Game;
