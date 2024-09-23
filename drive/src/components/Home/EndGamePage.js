import React from 'react'
import './EndGamePage.css';
import { Link } from 'react-router-dom';

const EndGamePage = ({score, navigate,onGameStatus, onRestart}) => {
    const sendGameStatus = () => {
        const gameActive = false; // Данные, которые мы хотим передать родителю
        navigate('/')
        onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
      };
    
      const restartGame = () => {
        onRestart(); // Вызов функции для перезапуска игры
    };
      
  return (
    <div className='endOfgamePage'>
      <div className='scoreAndTextCss'>
      <h1 className='whiteText'>Nice!</h1>
      <h3 className='whiteText'>You score {score} DP</h3>
      </div>
      <div className='endBtn'>
      <button onClick={sendGameStatus} className='homeBackBtn'>Back to homepage</button>
      <Link to="/game" >
      <button onClick={restartGame} className='playAnotherTime'>Play (5 left)</button> 
      </Link>
     
      </div>
    </div>
    
  )
}

export default EndGamePage