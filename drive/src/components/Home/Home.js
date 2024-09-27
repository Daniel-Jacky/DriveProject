import React, { useEffect } from 'react';
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/car.png'; // путь к изображению машины
import './Home.css';
import { useUser } from './UserContext'; // Импортируем контекст пользователя

const Home = ({ onGameStatus }) => {
    const { username, setUsername, chatId, setChatId, score, setScore } = useUser(); // Получаем данные пользователя и функции для их обновления

    const sendDataToParent = () => {
        const gameActive = true; // Данные, которые мы хотим передать родителю
        onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
    };

    useEffect(() => {
        // Если chatId уже установлен, не выполняем код
        if (chatId) return;

        // Получаем хэш-часть URL
        const hash = window.location.hash;
        // Удаляем начальный символ '#' и разделяем на параметры
        const paramsString = hash.slice(1);
        const params = new URLSearchParams(paramsString);
        const newChatId = params.get('chatId'); // Исправлено
        const newUsername = params.get('username');

        // Устанавливаем данные в контекст
        setChatId(newChatId);
        setUsername(newUsername);
        setScore(0); // Начальное количество очков

        // Выводим параметры в консоль
        console.log(`Chat ID: ${newChatId}, Username: ${newUsername}`);
    }, [setChatId, setUsername, chatId]); // Добавили chatId в зависимости

    return (
        <div className="App">
            <div className="NameAndStat">
                <div className="user-info">
                    <h2 className='User'>{username || 'Guest'}</h2>
                    <img alt="User Avatar" className="user-avatar" />
                </div>
                <h2 className='Points'>{score} Points</h2> {/* Отображаем очки из контекста */}
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
