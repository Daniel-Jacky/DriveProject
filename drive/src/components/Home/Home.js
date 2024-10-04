import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/car.png'; // Путь к изображению машины
import './Home.css';
import { useUser } from './UserContext'; // Импортируем контекст пользователя
import { fetchUserData, getUserByChatId } from '../api'; // Импортируем функции из api.js

const Home = ({ onGameStatus }) => {
    const {
        username, setUsername, chatId, setChatId, 
        score, setScore, avatar, setAvatar, 
        gamesLeft, setGamesLeft 
    } = useUser(); // Получаем данные пользователя и функции для их обновления

   
    const [generatedAvatar, setGeneratedAvatar] = useState('');
    const [apiData, setApiData] = useState(null); // Состояние для хранения данных из API
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true); // Состояние загрузки скелетона


    const sendDataToParent = () => {
        onGameStatus(true); // Передаем в родительский компонент статус игры
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUserData(); // Получаем данные из API
            setApiData(data); // Устанавливаем полученные данные в состояние
            setIsLoadingSkeleton(false); // Убираем состояние загрузки скелетона
        };

        fetchData(); // Вызов функции для получения данных
    }, []); // Пустой массив зависимостей, чтобы вызвать один раз при монтировании компонента

    useEffect(() => {
        if (apiData) {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.slice(1));

            const newChatId = params.get('/?chatId') || chatId;
            const newAvatar = params.get('avatarUrl');
            
            const user = getUserByChatId(apiData, newChatId); // Получаем пользователя по chatId

            if (user) {
                setUsername(user.username);
                setScore(user.score);
                setGamesLeft(user.gamesLeft);
            }

            setChatId(newChatId);

            if (newAvatar) {
                setAvatar(newAvatar);
            } else {
                const avatarUrl = generateAvatar(user?.username || '');
                setAvatar(avatarUrl);
                setGeneratedAvatar(avatarUrl);
            }

            console.log(`Chat ID: ${newChatId}, Username: ${user?.username || ''}`);
        }
    }, [apiData, chatId, setChatId, setUsername, setScore, setAvatar, setGamesLeft]);

    const generateAvatar = (username) => {
        if (!username) return 'https://dummyimage.com/100/cccccc/ffffff.png&text=?';
        return `https://ui-avatars.com/api/?name=${username[0].toUpperCase()}&background=random`;
    };

    return (
        <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
            <div className="App">
                <h4>1.0</h4>
                <div className="NameAndStat">
                    <div className="user-info">
                        <h2 className="User">
                            {isLoadingSkeleton ? <Skeleton width={150} /> : username || 'Guest'}
                        </h2>
                        {isLoadingSkeleton ? (
                            <Skeleton circle={true} height={100} width={100} />
                        ) : (
                            <img src={avatar || generatedAvatar} alt="User Avatar" className="user-avatar" />
                        )}
                    </div>
                    <h2 className="Points">
                        {isLoadingSkeleton ? <Skeleton width={150} /> : `${score} Points`}
                    </h2>
                </div>

                <div className="playArea">
                    <div className="dropGameBox">
                        <h3 className="dropGame">
                            {isLoadingSkeleton ? <Skeleton width={100} /> : 'Drop game'}
                        </h3>
                        <h4 className="timeToPlay">
                            {isLoadingSkeleton ? <Skeleton width={50} /> : gamesLeft}
                        </h4>
                    </div>

                    <div className="imageContainer">
                        {isLoadingSkeleton ? (
                            <Skeleton height={70} width={50} />
                        ) : (
                            <img
                                src={carImage}
                                className="playerCarHome"
                                alt="Player Car"
                            />
                        )}
                    </div>

                    {isLoadingSkeleton ? (
                        <Skeleton width={80} height={40} borderRadius={20} />
                    ) : (
                        <PlayButton onClick={sendDataToParent} className="playBtn">
                            Play
                        </PlayButton>
                    )}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default Home;
