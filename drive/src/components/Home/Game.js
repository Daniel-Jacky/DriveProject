import React, { useState, useEffect, memo, Suspense } from 'react';
import './Game.css';
import EndGamePage from './EndGamePage';
import { useNavigate } from 'react-router-dom';
import { formatTime } from './utils';
import usePlayerMovement from './usePlayerMovement';
import useCollisionCheck from './useCollisionCheck';
import { useUser } from './UserContext';

// Динамическая загрузка компонентов
const Bubble = React.lazy(() => import('./Bubble'));
const PlayerBubble = React.lazy(() => import('./PlayerBubble'));

// Пул объектов для пузырей
const createBubble = (bubbleSize) => ({
  id: Math.random(),
  x: Math.random() * (window.innerWidth - bubbleSize),
  color: Math.random() < 0.15 ? 'red' : 'blue',
  createdAt: Date.now(),
  speed: Math.random() * 2 + 1,
});

function Game({ onGameStatus }) {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setLocalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 1.3 });
  const [gameOver, setGameOver] = useState(false);
  const { setScore } = useUser();
  const [hitRedBubble, setHitRedBubble] = useState(false);
  
  const playerWidth = 10;
  const playerHeight = 45;
  const bubbleSize = 40;

  usePlayerMovement(playerWidth, playerHeight, setPlayerPosition);

  useEffect(() => {
    if (gameOver) {
      setScore((prevScore) => prevScore + score); // Суммируем старые очки с новыми
      return;  
    }
    
    // Устанавливаем стартовую позицию при каждом старте игры
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 1.3 });
  }, [gameOver]);  // Восстанавливаем позицию при каждом рестарте игры

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
        setBubbles((prevBubbles) => {
          return [...prevBubbles, createBubble(bubbleSize)];
        });
      }, 150); // Увеличиваем временной интервал между созданием пузырей
      return () => clearInterval(bubbleInterval);
    }
  }, [timeLeft]);

  useCollisionCheck(bubbles, playerPosition, setBubbles, setLocalScore, setExplosions, gameOver, playerWidth, playerHeight, bubbleSize, setHitRedBubble);

  // Удаляем пузыри, которые вышли за границы экрана
  useEffect(() => {
    const handleResize = () => {
      // Пересчитываем положение пузырей при изменении размера экрана
      setBubbles((prevBubbles) => 
        prevBubbles.filter((bubble) => {
          const bubbleAge = (Date.now() - bubble.createdAt) / 1000;
          const bubbleY = Math.min(bubbleAge * (window.innerHeight / 6) * bubble.speed, window.innerHeight);
          return bubbleY < window.innerHeight + bubbleSize; // Учитываем новый размер окна
        })
      );
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setBubbles([]);
    setExplosions([]);
    setLocalScore(0);
    setTimeLeft(30);
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 1.5 });
    
  };

  return (
    <div className="game">
      {!gameOver ? (
        <>
      {hitRedBubble && (
      <>
        <div className="cyber-edge cyber-edge-left"></div>
        <div className="cyber-edge cyber-edge-right"></div>
      </>
    )}
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
          {/* Используем Suspense для ожидания загрузки PlayerBubble */}
          <Suspense fallback={<div>Loading Player...</div>}>
            <PlayerBubble x={playerPosition.x} y={playerPosition.y} />
          </Suspense>
          <Suspense fallback={<div>Loading Bubbles...</div>}>
            {bubbles.map((bubble) => (
              <MemoizedBubble key={bubble.id} x={bubble.x} createdAt={bubble.createdAt} color={bubble.color} speed={bubble.speed} />
            ))}
          </Suspense>
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
