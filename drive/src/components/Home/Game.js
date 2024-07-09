import React, { useState, useEffect } from 'react';
import Bubble from './Bubble';
import PlayerBubble from './PlayerBubble';
import './Game.css';

function Game() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      setPlayerPosition({ x: touch.clientX, y: touch.clientY });
    };

    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPlayerPosition({ x: event.clientX, y: event.clientY });
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
          x: Math.random() * window.innerWidth,
          createdAt: Date.now(),
        };
        setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
      }, 500);
      return () => clearInterval(bubbleInterval);
    }
  }, [timeLeft]);

  useEffect(() => {
    const checkCollision = () => {
      const playerRadius = 25; // Радиус машины
      const bubbleRadius = 25; // Радиус пузыря
      const updatedBubbles = bubbles.filter((bubble) => {
        const bubbleAge = (Date.now() - bubble.createdAt) / 1000; // Возраст пузыря в секундах
        const bubbleY = bubbleAge * (window.innerHeight / 5); // Анимация падения
        const distance = Math.sqrt(
          (playerPosition.x - bubble.x) ** 2 +
          (playerPosition.y - bubbleY) ** 2
        );
        if (distance < playerRadius + bubbleRadius) {
          setScore((prevScore) => prevScore + 1);
          return false;
        }
        return true;
      });
      setBubbles(updatedBubbles);
    };

    const collisionInterval = setInterval(checkCollision, 50);
    return () => clearInterval(collisionInterval);
  }, [bubbles, playerPosition]);

  return (
    <div className="game">
      {!gameOver ? (
        <>
          <h1>Осталось времени: {timeLeft}</h1>
          <h1>Счет: {score}</h1>
          <PlayerBubble x={playerPosition.x - 25} y={playerPosition.y - 25} />
          {bubbles.map((bubble) => (
            <Bubble key={bubble.id} x={bubble.x} createdAt={bubble.createdAt} />
          ))}
        </>
      ) : (
        <div className="game-over">
          <h1>Игра окончена!</h1>
          <h2>Ваш счет: {score}</h2>
          <button onClick={() => window.location.reload()}>Назад на главный экран</button>
        </div>
      )}
    </div>
  );
}

export default Game;
