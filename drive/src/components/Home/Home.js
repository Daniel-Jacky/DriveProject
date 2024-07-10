import React, { useState } from 'react';
import PlayButton from './PlayButton/PlayButton'
import ProgressBar from './ProgressBar/ProgressBar';
import './Home.css';



const Home = ({ onData }) => {
  const sendDataToParent = () => {
    const gameActive = true; // Данные, которые мы хотим передать родителю
    onData(gameActive); // Вызываем функцию из пропсов и передаем ей данные
  };
  
  // const [gameActive, setGameActive] = useState(false);
  // const startGame = () => {
  //   setGameActive(true);
  // };
  // const endGame = () => {
  //   setGameActive(false);
  // };

  return (
    <div className="App">
      <header>
        <div className="NameAndStat">
        <h2 className='User'> Telegramm User</h2>
        <h2 className='Points'>10.000 Points</h2>
        </div>
      </header>
      <div className="BtnAndBar">
        <PlayButton  onClick={sendDataToParent} className="custom-button">
          Play game
        </PlayButton>
        <ProgressBar/> 
        </div>
    </div>
  )
}

export default Home