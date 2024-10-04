// src/components/EndGamePage.js
import React, { useEffect, useState } from 'react';
import './EndGamePage.css';
import { useUser } from './UserContext';
import { updateUserScore, fetchUserData, getUserByChatId} from '../api'; // Импортируем функции из api.js

const EndGamePage = ({ score, navigate, onGameStatus, onRestart }) => {
  const { chatId, gamesLeft, setGamesLeft } = useUser();
  const [currentScore, setCurrentScore] = useState(0); 
  const [newGamesLeft, setNewGamesLeft] = useState(gamesLeft);// Состояние для текущих очков
  const [isDecremented, setIsDecremented] = useState(false);

  // Уменьшаем newGamesLeft только один раз
  useEffect(() => {
    const decrementGamesLeft = async () => {
      if (!isDecremented && gamesLeft > 0) {
        let newGamesLeft = gamesLeft - 1;
        setNewGamesLeft(newGamesLeft);  // Локально обновляем значение
        setGamesLeft(newGamesLeft);     // Обновляем в UserContext
        setIsDecremented(true);    // Отмечаем, что уменьшение произошло
      }
    };

    decrementGamesLeft();
  }, [chatId, gamesLeft, setGamesLeft, currentScore, isDecremented]);

  useEffect(() => {
    const getCurrentScore = async () => {
      try {
        const apiData = await fetchUserData(chatId);
        const userData = getUserByChatId(apiData, chatId)
        setCurrentScore(userData.score || 0); // Устанавливаем текущее значение очков или 0
      } catch (error) {
        console.error('Ошибка при получении текущих очков:', error);
      }
    };

    getCurrentScore();
  }, [chatId]);

  const sendGameStatus = async () => {
    const newScore = currentScore + score; // Суммируем текущие и новые очки
    setGamesLeft(newGamesLeft)
    await updateUserScore(chatId, newScore,  newGamesLeft); // Обновляем очки
    navigate('/'); // Перенаправляем на главную страницу
    onRestart(); // Сначала перезапускаем игру
  };

  const restartGame = async (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение кнопки
    onRestart(); // Сначала перезапускаем игру
    navigate('/game'); // Затем программно осуществляем навигацию на игру
    const newScore = currentScore + score;
    setGamesLeft(newGamesLeft)
    await updateUserScore(chatId, newScore,  newGamesLeft); // Обновляем очки
  };

  const getResultMessage = (score) => {
    if (score >= 120) {
      return 'Legend!';
    } else if (score >= 100) {
      return 'Great job!';
    } else if (score >= 70) {
      return 'Nice!';
    } else if (score >= 50) {
      return 'Good!';
    } else if (score >= 30) {
      return 'You can more!';
    } else {
      return 'Keep trying!';
    }
  };

  return (
    <div className='endOfgamePage'>
      <div className='scoreAndTextCss'>
        <h1 className='whiteText'>{getResultMessage(score)}</h1>
        <h3 className='whiteText'>You score {score} DP</h3>
      </div>
      <div className='endBtn'>
        <button onClick={sendGameStatus} className='homeBackBtn'>Back to homepage</button>
        <button onClick={restartGame} className='playAnotherTime' disabled={newGamesLeft <= 0}>Play ({newGamesLeft} left)</button>
      </div>
    </div>
  );
};

export default EndGamePage;
