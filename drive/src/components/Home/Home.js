import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/car.png'; // Путь к изображению машины
import './Home.css';
import { useUser } from '../UserContext'; // Импортируем контекст пользователя
import { getUserByChatId, updateUserTimeGamesAdded, addRefFriend } from '../api'; // Импортируем функции из api.js
import { useNavigate } from 'react-router-dom';

const Home = ({ }) => {
    const {
        username, setUsername, chatId, setChatId,
        score, setScore, avatar, setAvatar,
        gamesLeft, setGamesLeft, currentStreak, setCurrentStreak, lastTimeGamesAdded, setLastTimeGamesAdded, updatedToday, setUpdatedToday,
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
            let newChatId = params.get('/?chatId') || chatId;
// ref
            debugger
            const decodedUrl = decodeURIComponent(hash);
            const startParamPos = decodedUrl.indexOf('start_param=');

            // Если параметр найден, извлекаем его значение
                    if (startParamPos !== -1) {
                        // Извлекаем всё после 'start_param='
                        const startParamValue = decodedUrl.substring(startParamPos + 'start_param='.length);
                        
                        // Если есть дополнительные параметры, обрезаем строку до следующего параметра
                        const endPos = startParamValue.indexOf('&');
                        const startParam = endPos !== -1 ? startParamValue.substring(0, endPos) : startParamValue;
                        
                        console.log('start_param:', startParam); // Выведет "ref_aedbb335-473b-439d-9ec2-860fc46ebea5"
                        if (startParam && startParam.startsWith('ref_')) {
                            const refCode = startParam.substring(4); // Извлекаем значение после "ref_"
                            console.log('Referral code:', refCode);

                            // 1. Извлекаем параметр tgWebAppData
                            const params1 = new URLSearchParams(hash);
                            const tgWebAppData = params1.get('tgWebAppData');

                            // 2. Декодируем первый уровень URL-кодировки
                            const decodedData = decodeURIComponent(tgWebAppData);

                            // 3. Убираем префикс 'user='
                            const cleanData = decodedData.replace('user=', '');

                            // 4. Декодируем второй уровень URL-кодировки
                            const userDataString = decodeURIComponent(cleanData);

                            // 5. Отрезаем лишние данные после JSON (находим первый '&')
                            const jsonPart = userDataString.split('&')[0];

                            // 6. Преобразуем строку в объект и извлекаем username

                            let username;
                            let firstname;
                            let lastname;
                            try {
                                const userData = JSON.parse(jsonPart);
                                username = userData.username;
                                firstname = userData.first_name
                                lastname = userData.lastname
                                console.log(username); // Выведет 'danielgi97'
                            } catch (e) {
                                console.error('Ошибка парсинга JSON:', e);
                            }
            
                            // Здесь можно вызвать метод для отправки этого параметра на сервер
                            // Например, через API или использование в Telegram Web App логике
                            const newAvatar = params.get('avatarUrl');
                            const addRed = await addRefFriend(newChatId, firstname, lastname, username, newAvatar, refCode);
                            console.log(addRed)
                        } else {
                            console.log('Параметр ref_ не найден.');
                        }
                        
                    } else {
                        console.log('Параметр start_param не найден.');
                    }
// ref
            if (newChatId) {
                const user = await getUserByChatId(newChatId); // Получаем данные пользователя
                setApiData(user); // Устанавливаем данные пользователя
            }
            setIsLoadingSkeleton(false); // Убираем состояние загрузки скелетона


            // Получаем параметр из ссылки
            // const urlParams = new URLSearchParams(window.location.hash);
            // const urlParams = 'tgWebAppData=user%3D%257B%2522id%2522%253A6578624309%252C%2522first_name%2522%253A%2522Daniel%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522danielgi97%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D-1023297304681969391%26chat_type%3Dprivate%26start_param%3Dref_aedbb335-473b-439d-9ec2-860fc46ebea5%26auth_date%3D1728337660%26hash%3Dd4f93ccb815f9a6a9cf50f18871fc4dea72d14029f0321d9013f7dadf6132e39&tgWebAppVersion=7.10&tgWebAppPlatform=weba&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23000000%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%233390ec%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23707579%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D"';
           
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
                <h4>5.3.11</h4>
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
