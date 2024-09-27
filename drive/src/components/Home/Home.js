import React, { useState, useEffect } from 'react';
import PlayButton from './PlayButton/PlayButton';
import ProgressBar from './ProgressBar/ProgressBar';
import carImage from './Assets/car.png'; // путь к изображению машины
import './Home.css';

const Home = ({ onGameStatus }) => {
  const sendDataToParent = () => {
    const gameActive = true; // Данные, которые мы хотим передать родителю
    onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
  };

  const [userData, setUserData] = useState({
    chatId: '',
    username: ''
  });

  useEffect(() => {  // Извлекаем параметры из URL при загрузке компонента
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
      username,
      avatarUrl: `https://t.me/i/userpic/320/${chatId}.jpg`
    });

    // Выводим параметры в консоль
    console.log(`Chat ID: ${chatId}, Username: ${username}`);
  }, []); // [] пустой массив для того, чтобы useEffect сработал только при монтировании компонента


  return (
    <div className="App">
      <div className="NameAndStat">
        <div className="user-info">
          <h2 className='User'>{userData.username || 'Guest'}</h2>
          <img src={userData.avatarUrl} alt="User Avatar" className="user-avatar" />
        </div>
        <h2 className='Points'>10.000 Points</h2>
      </div>
      <div className="playArea">
        <div className='dropGameBox'>
          <h3 className='dropGame'>Drop game</h3>
          <h4 className='timeToPlay'>5</h4>
        </div>
        <div className="imageContainer">
          <img
            src={carImage}
            className="playerCarHome"
            alt="Player Car"
          />
        </div>
        <PlayButton onClick={sendDataToParent} className="playBtn">
          Play
        </PlayButton>
      </div>

      {/* <ProgressBar /> */}
    </div>
  );
}

export default Home;
