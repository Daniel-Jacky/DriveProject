import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/car.png'; // Путь к изображению машины
import './Home.css';
import { useUser } from '../UserContext'; // Импортируем контекст пользователя
import { getUserByChatId, updateUserTimeGamesAdded } from '../api'; // Импортируем функции из api.js
import { useNavigate } from 'react-router-dom';

const Home = ({ }) => {
    const {
        username, setUsername, chatId, setChatId,
        score, setScore, avatar, setAvatar,
        gamesLeft, setGamesLeft, currentStreak, setCurrentStreak, lastTimeGamesAdded, setLastTimeGamesAdded,  updatedToday, setUpdatedToday,
        checkRewards, setCheckRewards, setLocalSaveScore
    } = useUser(); // Получаем данные пользователя и функции для их обновления


    const [generatedAvatar, setGeneratedAvatar] = useState('');
    const [apiData, setApiData] = useState(null); // Состояние для хранения данных из API
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true); // Состояние загрузки скелетона
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.slice(1));
            const newChatId = params.get('/?chatId') || chatId;

            if (newChatId) {
                const user = await getUserByChatId(newChatId); // Получаем данные пользователя
                setApiData(user); // Устанавливаем данные пользователя
            }

            setIsLoadingSkeleton(false); // Убираем состояние загрузки скелетона
        };

        fetchData(); // Вызов асинхронной функции
    }, []); // Пустой массив зависимостей, чтобы вызывать один раз при монтировании компонента

    useEffect(() => {
        if (apiData) {
            const user = apiData;
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.slice(1));

            const newChatId = params.get('/?chatId') || chatId;
            const newAvatar = params.get('avatarUrl');

            if (user) {
                setUsername(user.username);
                setScore(user.score);
                setLocalSaveScore(user.score)
                setGamesLeft(user.gamesLeft);
                setLastTimeGamesAdded(user.lastTimeGamesAdded)
                setCurrentStreak(user.currentStreak)
                setUpdatedToday(user.updatedToday)
            }

            setChatId(newChatId);

            if (newAvatar) {
                setAvatar(newAvatar);
            } else {
                const avatarUrl = generateAvatar(user?.username || '');
                setAvatar(avatarUrl);
                setGeneratedAvatar(avatarUrl);
            }

            const currentDate = new Date(),
                lastStreak = new Date(user.lastTimeGamesAdded),
                isStreak = currentDate - lastStreak,
                  isStreakDifferentInHours = Math.floor(isStreak / (1000 * 60 * 60));
                // isStreakDifferentInHours = 25;
            if (isStreakDifferentInHours > 24 && isStreakDifferentInHours < 48 && !user.updatedToday) {
                setCheckRewards(false)
                let newCurrentStreak = '';
                if (user.currentStreak === 5) {
                    newCurrentStreak = 0
                } else {
                    newCurrentStreak = user.currentStreak + 1;
                }
                const newGamesLeft = newCurrentStreak + user.gamesLeft + 5;
                const newLastTimeGamesAdded = new Date();
                const updateTime = updateUserTimeGamesAdded(chatId, newGamesLeft, newCurrentStreak, newLastTimeGamesAdded, !user.updatedToday);
                setGamesLeft(newGamesLeft);
                setCurrentStreak(newCurrentStreak);
                setLastTimeGamesAdded(newLastTimeGamesAdded);
            } else if (isStreakDifferentInHours > 48) {
                setCheckRewards(false)
                const newLastTimeGamesAdded = new Date();
                const newGamesLeft = user.gamesLeft + 5;
                const updateTime = updateUserTimeGamesAdded(chatId, newGamesLeft, 0, newLastTimeGamesAdded, !user.updatedToday);
                setGamesLeft(gamesLeft);
                setCurrentStreak(0)
            } else {
                setCheckRewards(true)
            }

            console.log(`Chat ID: ${newChatId}, Username: ${user?.username || ''}`);
            console.log(user)

        }
    }, [apiData, chatId, setChatId, setUsername, setScore, setAvatar, setGamesLeft, setLocalSaveScore]);

    const generateAvatar = (username) => {
        if (!username) return 'https://dummyimage.com/100/cccccc/ffffff.png&text=?';
        return `https://ui-avatars.com/api/?name=${username[0].toUpperCase()}&background=random`;
    };

    if (!checkRewards) {
        console.log(checkRewards + 'uppp')
        navigate('/rewards')
    }


    return (
        <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
            <div className="App">
                <h4>2.3.2</h4>
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
                        <PlayButton className="playBtn">
                            Play
                        </PlayButton>
                    )}
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default Home;
