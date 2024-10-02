import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Импортируем axios
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/car.png'; // путь к изображению машины
import './Home.css';
import { useUser } from './UserContext'; // Импортируем контекст пользователя

const Home = ({ onGameStatus }) => {
    const { username, setUsername, chatId, setChatId, score, setScore, avatar, setAvatar } = useUser(); // Получаем данные пользователя и функции для их обновления
    const [generatedAvatar, setGeneratedAvatar] = useState('');
    const [apiData, setApiData] = useState(null); // Состояние для хранения данных из API

    const sendDataToParent = () => {
        const gameActive = true; // Данные, которые мы хотим передать родителю
        onGameStatus(gameActive); // Вызываем функцию из пропсов и передаем ей данные
    };

    useEffect(() => {
        // Функция для получения данных из API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://fudg-test2.ru/users');
                setApiData(response.data); // Устанавливаем полученные данные в состояние
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData(); // Вызов функции для получения данных
    }, []); // Пустой массив зависимостей, чтобы вызвать один раз при монтировании компонента


    useEffect(() => {
        if (apiData) {
            const data = apiData
            const hash = window.location.hash;
            const paramsString = hash.slice(1);
            const params = new URLSearchParams(paramsString);
            let newChatId = params.get('/?chatId');
            // const newUsername = params.get('username');
            const newAvatar = params.get('avatarUrl');
            let newUsername = '';
            let newScore = '';
    
            for (let i = 0; i < data.length; i++) {
                if(newChatId = data[i].chatId){
                    newUsername = data[i].username
                    newScore = data[i].score
                }
            }
            // Устанавливаем данные в контекст
            setChatId(newChatId);
            setUsername(newUsername);
            setScore(newScore)
            if (newAvatar) {
                setAvatar(newAvatar);
            } else {
                const avatarUrl = generateAvatar(newUsername);
                setAvatar(avatarUrl);
                setGeneratedAvatar(avatarUrl); // Устанавливаем сгенерированную аватарку
            }
    
            console.log(`Chat ID: ${newChatId}, Username: ${newUsername}`);
        }
      }, [apiData, setChatId, setUsername, chatId]);

    const generateAvatar = (username) => {
        if (!username) return `https://dummyimage.com/100/cccccc/ffffff.png&text=?`;
        const firstLetter = username.charAt(0).toUpperCase();
        return `https://ui-avatars.com/api/?name=${firstLetter[0]}&background=random`;
    };
    console.log(apiData)

    return (
        <div className="App">
            <div className="NameAndStat">
                <div className="user-info">
                    <h2 className='User'>{username || 'Guest'}</h2>
                    <img src={avatar || generatedAvatar} alt="User Avatar" className="user-avatar" />
                </div>
                <h2 className='Points'>{score} Points</h2>
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





    // useEffect(() => {
    //     // Если chatId уже установлен, не выполняем код
    //     if (chatId) return;

    //     // Получаем хэш-часть URL
    //     const hash = window.location.hash;
    //     const paramsString = hash.slice(1);
    //     const params = new URLSearchParams(paramsString);
    //     let newChatId = params.get('/?chatId');
    //     // const newUsername = params.get('username');
    //     const newAvatar = params.get('avatarUrl');
    //     let newUsername = '';

    //     for (let i = 0; i < apiData.length; i++) {
    //         if(newChatId = apiData[i].chatId){
    //             newUsername = apiData[i].username
    //         }
    //     }

    //     // Устанавливаем данные в контекст
    //     setChatId(newChatId);
    //     setUsername(newUsername);
    //     if (newAvatar) {
    //         setAvatar(newAvatar);
    //     } else {
    //         const avatarUrl = generateAvatar(newUsername);
    //         setAvatar(avatarUrl);
    //         setGeneratedAvatar(avatarUrl); // Устанавливаем сгенерированную аватарку
    //     }

    //     console.log(`Chat ID: ${newChatId}, Username: ${newUsername}`);
    // }, [setChatId, setUsername, chatId]);