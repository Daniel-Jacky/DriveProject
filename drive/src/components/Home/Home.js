import React, { useState, useEffect } from 'react';
import PlayButton from './PlayButton/PlayButton';
import ProgressBar from './ProgressBar/ProgressBar';
import carImage from './Assets/car.png'; // путь к изображению машины
import './Home.css';

const Home = ({ onData }) => {
  const sendDataToParent = () => {
    const gameActive = true; // Данные, которые мы хотим передать родителю
    onData(gameActive); // Вызываем функцию из пропсов и передаем ей данные
  };

  const [userData, setUserData] = useState({
    chatId: '',
    username: ''
  });

  // Извлекаем параметры из URL при загрузке компонента
  useEffect(() => {
    // Получаем хэш-часть URL
    const hash = window.location.hash;
    // Удаляем начальный символ '#' и разделяем на параметры
    const paramsString = hash.slice(1);
    const params = new URLSearchParams(paramsString);
    
    const chatId = params.get('chatId');
    const username = params.get('username');

    // Устанавливаем полученные данные в state
    setUserData({
      chatId,
      username
    });

    // Выводим параметры в консоль
    console.log(`Chat ID: ${chatId}, Username: ${username}`);
  }, []); // [] пустой массив для того, чтобы useEffect сработал только при монтировании компонента

  return (
    <div className="App">
      <div className="NameAndStat">
        <h2 className='User'>{userData.username || 'Guest'}</h2>
        <h2 className='Points'>10.000 Points</h2>
      </div>

      <img
        src={carImage}
        alt="Player Car"
        className="player-car"
      />

      <div className="playArea">
        <div className='dropGameBox'>
          <h3 className='dropGame'>Drop game</h3>
          <h4 className='timeToPlay'>5</h4>
        </div>
        <div className="roadline"></div> {/* Добавляем линию дороги */}
        <PlayButton onClick={sendDataToParent} className="playBtn">
          Play
        </PlayButton>
      </div>

      {/* <ProgressBar /> */}
    </div>
  );
}

export default Home;
