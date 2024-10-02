// src/components/EndGamePage.js
import React, { useEffect, useState } from 'react';
import './EndGamePage.css';
import { useUser } from './UserContext';
import { updateUserScore, fetchUserData, getUserByChatId} from '../api'; // Импортируем функции из api.js

const EndGamePage = ({ score, navigate, onGameStatus, onRestart }) => {
  const { chatId } = useUser();
  const [currentScore, setCurrentScore] = useState(0); // Состояние для текущих очков

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
    const gameActive = false; // Данные, которые мы хотим передать родителю
    const newScore = currentScore + score; // Суммируем текущие и новые очки
    await updateUserScore(chatId, newScore); // Обновляем очки
    onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
    navigate('/'); // Перенаправляем на главную страницу
    onRestart(); // Сначала перезапускаем игру
  };

  const restartGame = (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение кнопки
    onRestart(); // Сначала перезапускаем игру
    navigate('/game'); // Затем программно осуществляем навигацию на игру
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
        <button onClick={restartGame} className='playAnotherTime'>Play (5 left)</button>
      </div>
    </div>
  );
};

export default EndGamePage;
