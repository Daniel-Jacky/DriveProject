import React, { useState, useEffect, memo } from 'react';
import Bubble from './Bubble';
import PlayerBubble from './PlayerBubble';
import './Game.css';
import EndGamePage from './EndGamePage';
import { useNavigate } from 'react-router-dom';
import { formatTime } from './utils';
import usePlayerMovement from './usePlayerMovement';
import useCollisionCheck from './useCollisionCheck';

function Game({ onGameStatus }) {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [gameOver, setGameOver] = useState(false);

  const playerWidth = 10;
  const playerHeight = 45;
  const bubbleSize = 40;

  usePlayerMovement(playerWidth, playerHeight, setPlayerPosition);

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
        const speed = Math.random() * 2 + 1.5;
        const newBubble = {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - bubbleSize),
          color: Math.random() < 0.15 ? 'red' : 'blue',
          createdAt: Date.now(),
          speed: speed,
        };
        setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
      }, 150);
      return () => clearInterval(bubbleInterval);
    }
  }, [timeLeft]);

  useCollisionCheck(bubbles, playerPosition, setBubbles, setScore, setExplosions, gameOver, playerWidth, playerHeight, bubbleSize);

  // Удаляем пузыри, которые вышли за границы экрана
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prevBubbles) => {
        const currentTime = Date.now();
        return prevBubbles.filter((bubble) => {
          const bubbleAge = (currentTime - bubble.createdAt) / 1000; // Возраст пузыря в секундах
          const bubbleY = Math.min(bubbleAge * (window.innerHeight / 6) * bubble.speed, window.innerHeight);
          return bubbleY < window.innerHeight; // Удаляем, если пузырь вышел за границы экрана
        });
      });
    }, 100); // Проверка каждые 100 мс

    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setBubbles([]);
    setExplosions([]);
    setScore(0);
    setTimeLeft(30);
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  return (
    <div className="game">
      {!gameOver ? (
        <>
          <div className='gameTimeAndScore'>
            <div className='timeLeft'>
              <h2>{formatTime(timeLeft)}</h2>
            </div>
            <div className='scores'>
              <h2 className='driveCoinLetter'>D</h2>
              <h2 className='points'>{score}</h2>
            </div>
          </div>
          <div className="side-line side-line-left"></div>
          <div className="side-line side-line-right"></div>
          <PlayerBubble x={playerPosition.x} y={playerPosition.y} />
          {bubbles.map((bubble) => (
            <MemoizedBubble key={bubble.id} x={bubble.x} createdAt={bubble.createdAt} color={bubble.color} speed={bubble.speed} />
          ))}
          {explosions.map((explosion) => (
            <MemoizedExplosion key={explosion.id} x={explosion.x} y={explosion.y} />
          ))}
        </>
      ) : (
        <EndGamePage score={score} navigate={navigate} onGameStatus={onGameStatus} onRestart={handleRestart} />
      )}
    </div>
  );
}

// Используем memo для оптимизации рендеринга пузырей
const MemoizedBubble = memo(Bubble);

// Создаем мемоизированный компонент для взрыва
const MemoizedExplosion = memo(({ x, y }) => (
  <div className="explosion" style={{ left: x, top: y }}></div>
));

export default Game;
