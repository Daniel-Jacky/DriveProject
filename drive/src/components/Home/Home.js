import React, { useState } from 'react';
import PlayButton from './PlayButton/PlayButton'
import ProgressBar from './ProgressBar/ProgressBar';
import './Home.css';



const Home = ({ onData }) => {
  const sendDataToParent = () => {
    const gameActive = true; // Данные, которые мы хотим передать родителю
    onData(gameActive); // Вызываем функцию из пропсов и передаем ей данные
  };

  return (
    <div className="App">

      <div className="NameAndStat">
        <h2 className='User'> Telegramm User</h2>
        <h2 className='Points'>10.000 Points</h2>
      </div>

      <div className="playArea">
        <div className='dropGameBox'>
        <h3 className='dropGame'>Drop game</h3>
        <h4>5</h4>
        </div>
        
        <PlayButton onClick={sendDataToParent} className="playBtn">
          Play
        </PlayButton>
      </div>

      <ProgressBar />
    </div>
  )
}

export default Home