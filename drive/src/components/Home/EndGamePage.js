// src/components/EndGamePage.js
import React, { useEffect, useState } from 'react';
import './EndGamePage.css';
import { useUser } from '../UserContext';
import { updateUserScore, getUserByChatId} from '../api'; // Импортируем функции из api.js

const EndGamePage = ({ score, navigate, onGameStatus, onRestart }) => {
  const { chatId, gamesLeft, setGamesLeft, totalFarm, setTotalFarm } = useUser();
  const [newGamesLeft, setNewGamesLeft] = useState(gamesLeft);// Состояние для текущих очков
  const [isDecremented, setIsDecremented] = useState(false);

  // Уменьшаем newGamesLeft только один раз
  useEffect(() => {
    const updateScoreAndDecrementGames = async () => {
      if (!isDecremented && gamesLeft > 0) {
        try {
          // Уменьшаем значение gamesLeft
          let newGamesLeft = gamesLeft - 1;
  
          // Получаем текущие очки пользователя
          const userData = await getUserByChatId(chatId);
          const newScore = userData.score + score;
          const newTotalFarm = Number(totalFarm) + Number(score);
  
          // Обновляем данные на сервере
          await updateUserScore(chatId, newScore, newGamesLeft, newTotalFarm);
  
          // Обновляем локальное состояние
          setNewGamesLeft(newGamesLeft);
          setGamesLeft(newGamesLeft);
          setTotalFarm(newTotalFarm);
          setIsDecremented(true);
        } catch (error) {
          console.error('Ошибка при обновлении очков:', error);
        }
      }
    };
  
    updateScoreAndDecrementGames();
  }, [chatId, gamesLeft, score, totalFarm, isDecremented]);

  const sendGameStatus = async () => {
    navigate('/'); // Перенаправляем на главную страницу
    onRestart(); // Сначала перезапускаем игру
  };

  const restartGame = async (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение кнопки
    onRestart(); // Сначала перезапускаем игру
    navigate('/game'); 
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
      return 'You can do more!';
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
        <button onClick={restartGame} className='playAnotherTime' disabled={newGamesLeft <= 0}>Rides ({newGamesLeft} left)</button>
      </div>
    </div>
  );
};

export default EndGamePage;
