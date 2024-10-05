import React, { useState, useEffect, memo, Suspense } from 'react';
import './Game.css';
import EndGamePage from './EndGamePage';
import { useNavigate } from 'react-router-dom';
import { formatTime } from './utils';
import usePlayerMovement from './usePlayerMovement';
import useCollisionCheck from './useCollisionCheck';
import { useUser } from '../UserContext';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from './storageUtils';

const Bubble = React.lazy(() => import('./Bubble'));
const PlayerBubble = React.lazy(() => import('./PlayerBubble'));

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
  const [timeLeft, setTimeLeft] = useState(10);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 1.3 });
  const [gameOver, setGameOver] = useState(false);
  const { setScore } = useUser();
  const [hitRedBubble, setHitRedBubble] = useState(false);
  const [loading, setLoading] = useState(true); // Добавляем состояние для отслеживания загрузки

  const playerWidth = 10;
  const playerHeight = 45;
  const bubbleSize = 40;

  useEffect(() => {
    // Инициализация объектов (пузыри, игрок и т.д.)
    const initializeGame = async () => {
      // Имитация загрузки данных или выполнения задач перед началом игры
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка для имитации загрузки (2 секунды)
      setLoading(false); // Отключаем экран загрузки после инициализации
    };

    initializeGame();
  }, []);

    useEffect(() => {
      if (!loading) {
        const handleResize = () => {
          setBubbles((prevBubbles) =>
            prevBubbles.filter((bubble) => {
              const bubbleAge = (Date.now() - bubble.createdAt) / 1000;
              const bubbleY = Math.min(bubbleAge * (window.innerHeight / 6) * bubble.speed, window.innerHeight);
              return bubbleY < window.innerHeight + bubbleSize;
            })
          );
        };
  
        window.addEventListener('resize', handleResize);
  
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, [loading]);

  // Восстанавливаем состояние игры при загрузке страницы
  useEffect(() => {
    const savedGameOver = loadFromLocalStorage('gameOver', false);
    const savedScore = loadFromLocalStorage('score', 0);
    const savedTimeLeft = loadFromLocalStorage('timeLeft', timeLeft);

    setGameOver(savedGameOver);
    setLocalScore(savedScore);
    setTimeLeft(savedTimeLeft);
  }, []);

  // Сохраняем состояние игры при закрытии страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage('gameOver', gameOver);
      saveToLocalStorage('score', score);
      saveToLocalStorage('timeLeft', timeLeft);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameOver, score, timeLeft]);

  useEffect(() => {
    if (gameOver) {
      setScore((prevScore) => prevScore + score); // Суммируем старые очки с новыми
      return;
    }
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 1.3 });
  }, [gameOver]);

  useEffect(() => {
    if(!loading){
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setGameOver(true);
      }
    }
  }, [timeLeft, loading]);

  useEffect(() => {
    if(!loading){
      if (timeLeft > 0) {
        const bubbleInterval = setInterval(() => {
          setBubbles((prevBubbles) => [...prevBubbles, createBubble(bubbleSize)]);
        }, 150);
        return () => clearInterval(bubbleInterval);
      }
    }
  }, [timeLeft,loading]);

  usePlayerMovement(playerWidth, playerHeight, setPlayerPosition);

  useCollisionCheck(bubbles, playerPosition, setBubbles, setLocalScore, setExplosions, gameOver, playerWidth, playerHeight, bubbleSize, setHitRedBubble);

  const handleRestart = () => {
    setGameOver(false);
    setBubbles([]);
    setExplosions([]);
    setLocalScore(0);
    setTimeLeft(10);
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 1.5 });
    removeFromLocalStorage('score'); // Очищаем сохраненные данные
    removeFromLocalStorage('timeLeft');
    removeFromLocalStorage('gameOver');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

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

const MemoizedBubble = memo(Bubble);

const MemoizedExplosion = memo(({ x, y }) => (
  <div className="explosion" style={{ left: x, top: y }}></div>
));

export default Game;
