import React, { useState, useEffect } from 'react';
import PlayButton from './PlayButton/PlayButton';
import ProgressBar from './ProgressBar/ProgressBar';
import carImage from './Assets/car.png'; // путь к изображению машины
import './Home.css';
import { useUser } from './UserContext'; // Импортируем контекст пользователя

const Home = ({ onGameStatus }) => {
    const { setUserData } = useUser(); // Получаем функцию для обновления данных пользователя из контекста
    const sendDataToParent = () => {
        const gameActive = true; // Данные, которые мы хотим передать родителю
        onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
    };

    const [userData, setLocalUserData] = useState({
        chatId: '',
        username: ''
    });

    useEffect(() => {  
        // Получаем хэш-часть URL
        const hash = window.location.hash;
        // Удаляем начальный символ '#' и разделяем на параметры
        const paramsString = hash.slice(1);
        const params = new URLSearchParams(paramsString);
        const chatId = params.get('/?chatId');
        const username = params.get('username');

        // Устанавливаем полученные данные в state
        const avatarUrl = `https://t.me/i/userpic/320/${chatId}.jpg`;
        setLocalUserData({
            chatId,
            username,
            avatarUrl
        });

        // Устанавливаем данные в контекст
        setUserData({
            chatId,
            username,
            score: 0, // Начальное количество очков
            avatarUrl
        });

        // Выводим параметры в консоль
        console.log(`Chat ID: ${chatId}, Username: ${username}`);
    }, [setUserData]); // Добавили setUserData в зависимости

    return (
        <div className="App">
            <div className="NameAndStat">
                <div className="user-info">
                    <h2 className='User'>{userData.username || 'Guest'}</h2>
                    <img src={userData.avatarUrl} alt="User Avatar" className="user-avatar" />
                </div>
                <h2 className='Points'>{userData.score}10000 Points</h2> {/* Отображаем очки из контекста */}
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
