import React, { useState, useEffect, memo} from 'react';
import Bubble from './Bubble';
import PlayerBubble from './PlayerBubble';
import './Game.css';
import EndGamePage from './EndGamePage';
import { useNavigate } from 'react-router-dom';

function Game({onGameStatus}) {
  const navigate = useNavigate(); // Хук для навигации
  const [bubbles, setBubbles] = useState([]);
  const [explosions, setExplosions] = useState([]); // Новый стейт для управления взрывами
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [gameOver, setGameOver] = useState(false);

  const playerWidth = 10; // Ширина машины
  const playerHeight = 45; // Высота машины
  const bubbleSize = 40; // Размер пузыря (ширина и высота)

    // Функция для форматирования времени в MM:SS
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    }

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
        
        const speed = Math.random() * 2 + 1.5; // Случайная скорость от 1 до 3
        const newBubble = {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - bubbleSize),
          color: Math.random() < 0.15 ? 'red' : 'blue', // 15% шанс на красный пузырь, 85% на голубой
          createdAt: Date.now(),
          speed: speed,
        };
        setBubbles((prevBubbles) => [...prevBubbles, newBubble]);
      }, 150); // Интервал создания пузырей
      return () => clearInterval(bubbleInterval); // Очистка интервала при размонтировании компонента
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!gameOver){
      const checkCollision = () => {
        const updatedBubbles = bubbles.filter((bubble) => {
          const bubbleAge = (Date.now() - bubble.createdAt) / 1000; // Возраст пузыря в секундах
          const bubbleY = bubbleAge * (window.innerHeight / 6) * bubble.speed; // Анимация падения

          // Проверка видимости пузыря
      // if (bubbleY > window.innerHeight || bubbleY + bubbleSize < 0) {
      //   return false; // Удаляем пузырь, если он вышел за пределы экрана
      // }
    
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
    
              // Вызов вибрации при сборе голубого пузыря (монетки)
              // if (navigator.vibrate) {
              //   navigator.vibrate(1000); // Вибрация длительностью 100 миллисекунд
              // }
    
            } else if (bubble.color === 'red') {
              setScore((prevScore) => Math.max(prevScore - 10, 0));
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
    }

  }, [bubbles, playerPosition]);

  const handleRestart = () => {
    setGameOver(false); // Перезапуск игры
    setBubbles([]); // Сброс пузырей
    setExplosions([]); // Сброс взрывов
    setScore(0); // Сброс очков
    setTimeLeft(30); // Сброс времени
    setPlayerPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); // Центрирование игрока
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
          <div className="side-line side-line-left"></div> {/* Левая линия */}
        <div className="side-line side-line-right"></div> {/* Правая линия */}
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
