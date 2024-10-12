import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PlayButton from './PlayButton/PlayButton';
import carImage from './Assets/purpleCar.webp'; // Путь к изображению машины
import './Home.css';
import { useUser } from '../UserContext'; // Импортируем контекст пользователя
import { getUserByChatId, updateUserTimeGamesAdded, addRefFriend, updateUserFarmButtonRewards, updateUserScore } from '../api'; // Импортируем функции из api.js
import { useNavigate } from 'react-router-dom';

const Home = ({ }) => {
    const {
        username, setUsername, chatId, setChatId,
        score, setScore, avatar, setAvatar,
        gamesLeft, setGamesLeft, currentStreak, setCurrentStreak, lastTimeGamesAdded, setLastTimeGamesAdded, updatedToday, setUpdatedToday,
        checkRewards, setCheckRewards, setLocalSaveScore, totalFarm, setTotalFarm, lastTimeRewardsAdded, setLastTimeRewardsAdded, rewardsUpdated, setRewardsUpdated,
        farmPoints, setFarmPoints
    } = useUser(); // Получаем данные пользователя и функции для их обновления


    const [generatedAvatar, setGeneratedAvatar] = useState('');
    const [apiData, setApiData] = useState(null); // Состояние для хранения данных из API
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true); // Состояние загрузки скелетона
    const navigate = useNavigate();
    const listRef = useRef(null); // Реф для списка друзей
    const [isTouching, setIsTouching] = useState(false); // Отслеживаем касание
    const [lastTouchY, setLastTouchY] = useState(0); // Последняя позиция касания
    const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 часов в секундах

    useEffect(() => {
        const fetchData = async () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.slice(1));
            let newChatId = params.get('/?chatId') || chatId;
            // ref

            const decodedUrl = decodeURIComponent(hash);
            const startParamPos = decodedUrl.indexOf('start_param=');

            // Если параметр найден, извлекаем его значение
            const user = await getUserByChatId(newChatId);    // Проверим, что chatId присутствует в базе, если не присутвует создаем по реф ссылке
            if (user !== null) {
                setApiData(user)
            } else if (startParamPos !== -1) {
                // Извлекаем всё после 'start_param='
                const startParamValue = decodedUrl.substring(startParamPos + 'start_param='.length);

                // Если есть дополнительные параметры, обрезаем строку до следующего параметра
                const endPos = startParamValue.indexOf('&');
                const startParam = endPos !== -1 ? startParamValue.substring(0, endPos) : startParamValue;

                if (startParam && startParam.startsWith('ref_')) {
                    const refCode = startParam.substring(4); // Извлекаем значение после "ref_"
                    console.log('Referral code:', refCode);

                    // 1. Извлекаем параметр tgWebAppData
                    const params1 = new URLSearchParams(hash);
                    const tgWebAppData = params1.get('#/?tgWebAppData');

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
                    let newId;
                    try {
                        const userData = JSON.parse(jsonPart);
                        newId     = userData.id;
                        username  = userData.username;
                        firstname = userData.first_name
                        lastname  = userData.lastname
                        console.log(username); // Выведет 'danielgi97'
                    } catch (e) {
                        console.error('Ошибка парсинга JSON:', e);
                    }


                    // Здесь можно вызвать метод для отправки этого параметра на сервер
                    // Например, через API или использование в Telegram Web App логике
                    const newAvatar = params.get('avatarUrl' || avatar);
                    const addRef = await addRefFriend(String(newId), firstname, lastname, username, newAvatar, refCode);
                    setApiData(addRef)
                    setChatId(String(newId))
                } else {
                    console.log('Параметр ref_ не найден.');
                }

            } else {
                console.log('Параметр start_param не найден.');
            }
            // ref
            // if (newChatId) {
            //     const user = await getUserByChatId(newChatId); // Получаем данные пользователя
            //     setApiData(user); // Устанавливаем данные пользователя
            // }
            setIsLoadingSkeleton(false); // Убираем состояние загрузки скелетона
            // Получаем параметр из ссылки
            // const urlParams = 'tgWebAppData=user%3D%257B%2522id%2522%253A6578624309%252C%2522first_name%2522%253A%2522Daniel%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522danielgi97%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D-1023297304681969391%26chat_type%3Dprivate%26start_param%3Dref_aedbb335-473b-439d-9ec2-860fc46ebea5%26auth_date%3D1728337660%26hash%3Dd4f93ccb815f9a6a9cf50f18871fc4dea72d14029f0321d9013f7dadf6132e39&tgWebAppVersion=7.10&tgWebAppPlatform=weba&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23000000%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%233390ec%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23707579%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D"';

        };

        fetchData(); // Вызов асинхронной функции
    }, []); // Пустой массив зависимостей, чтобы вызывать один раз при монтировании компонента

    useEffect(() => {
        if (apiData) {
            console.log(apiData)
            const user = apiData;
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.slice(1));

            const newChatId = params.get('/?chatId') || chatId;
    
            if (user) {
                setUsername(user.username);
                setScore(user.score);
                setLocalSaveScore(user.score)
                setGamesLeft(user.gamesLeft);
                setLastTimeGamesAdded(user.lastTimeGamesAdded)
                setCurrentStreak(user.currentStreak)
                setUpdatedToday(user.updatedToday)
                setTotalFarm(user.totalFarm)
                setLastTimeRewardsAdded(user.lastTimeRewardsAdded)
                setRewardsUpdated(user.rewardsUpdated)
                setFarmPoints(user.farmPoints)
            }
            user.avatar = params.get('avatarUrl') || user.avatar;


            setChatId(newChatId);

            if (user.avatar !== null) {
                setAvatar(user.avatar);
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
                    newCurrentStreak = 5;
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

            if (user.rewardsUpdated) {

                const currentDate = new Date();
                const gmtZeroDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
                const lastClickFarmBtn = new Date(user.lastTimeRewardsAdded);
                
                // Вычисление разницы во времени между двумя датами в миллисекундах
                const isFarmAvailiable = gmtZeroDate.getTime() - lastClickFarmBtn.getTime();
                const isStreakDifferentInHours = (Math.floor(isFarmAvailiable / (1000)));
                const totalSeconds = 8 * 60 * 60;
                const final = totalSeconds - isStreakDifferentInHours
                const newFarmPoints = isStreakDifferentInHours / 1000
                const farmBtnInfo = updateUserFarmButtonRewards(chatId, lastTimeRewardsAdded, rewardsUpdated, newFarmPoints); // Обновляем очки
                setFarmPoints(newFarmPoints)
                setTimeLeft(final)
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

    // Функции для работы с касаниями
    const handleTouchStart = (event) => {
        setIsTouching(true);
        setLastTouchY(event.touches[0].clientY); // Запоминаем позицию касания
    };

    const handleTouchMove = (event) => {
        if (!isTouching) return;

        const touchY = event.touches[0].clientY;
        const deltaY = lastTouchY - touchY; // Вычисляем расстояние перемещения пальца

        listRef.current.scrollTop += deltaY; // Скроллим список
        setLastTouchY(touchY); // Обновляем последнюю позицию касания
    };

    const handleTouchEnd = () => {
        setIsTouching(false);
    };

    useEffect(() => {
        let interval;
        if (rewardsUpdated) {
            interval = setInterval(() => {
                setFarmPoints((prevPoints) => {
                    const currentPoints = Number(prevPoints) || 0; // Убедитесь, что prevPoints — это число
                    return (currentPoints + 0.001).toFixed(3); // Добавляем 0.001 и округляем
                });
                setTimeLeft((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1; // Уменьшаем на 1 секунду
                    } else {
                        clearInterval(interval);
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [rewardsUpdated]);

    const handleButtonClick = async () => {

        if(farmPoints > 0){
         await updateUserFarmButtonRewards(chatId, lastTimeRewardsAdded, rewardsUpdated, farmPoints);
        const newScore = (Number(farmPoints) + Number(score)).toFixed()

         await updateUserScore(chatId, newScore,  gamesLeft, totalFarm);
         setFarmPoints(0);
         setScore(newScore);
        } else {
            const lastClickOnFarmBtn = new Date();
            const isRewardsUpdated = true
            const farmBtnInfo = await updateUserFarmButtonRewards(chatId, lastClickOnFarmBtn, isRewardsUpdated, farmPoints); // Обновляем очки
            setRewardsUpdated(isRewardsUpdated);
            setLastTimeRewardsAdded(lastClickOnFarmBtn)
        }
       
    };

    const formatTime = (totalSeconds) => {

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m`;
    };

    const isCompleted = timeLeft === 0;


    return (
        <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
            <div className="App">
                <div
                    className="home-list"
                    ref={listRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <h4>23.5.19</h4>
                    <div class="neon-text">Welcome to Drive</div>
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
                            <h4 className="dropGame">
                                {isLoadingSkeleton ? <Skeleton width={100} /> : 'Drop game'}
                            </h4>
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
                    {isLoadingSkeleton ? (
                            <Skeleton className="skeletonFriend-farming" />
                        ) : (
                            <button
                            className='homeFarmPoints'
                            onClick={handleButtonClick}
                            disabled={rewardsUpdated} // Кнопка будет недоступна, когда фарминг начался
                            style={{
                                background: rewardsUpdated
                                    ? `linear-gradient(to right, #ff6ec7 ${((8 * 60 * 60 - timeLeft) / (8 * 60 * 60)) * 100}%, #01f7f7 ${((8 * 60 * 60 - timeLeft) / (8 * 60 * 60)) * 100}%)`
                                    : 'linear-gradient(to right, #ff6ec7, #01f7f7)',
                                color: rewardsUpdated ? 'black' : 'white',
                                textShadow: '0px 0px 8px rgba(255, 255, 255, 0.8)',
                                borderRadius: '15px',
                                boxShadow: '0px 0px 20px rgba(255, 0, 255, 0.7), 0px 0px 20px rgba(0, 255, 255, 0.7)',
                                fontSize: '18px',
                                padding: '15px 25px',
                                position: 'fixed',
                                bottom: '80px',
                                width: '100%',
                                border: '2px solid #ff6ec7',
                                cursor: rewardsUpdated ? 'not-allowed' : 'pointer', // Курсор изменяется, если кнопка неактивна
                            }}
                            onMouseEnter={() => {
                                if (!rewardsUpdated) { // Анимация при наведении только если кнопка активна
                                    const btn = document.querySelector('.homeFarmPoints');
                                    btn.style.boxShadow = '0px 0px 25px rgba(255, 0, 255, 1), 0px 0px 25px rgba(0, 255, 255, 1)';
                                }
                            }}
                            onMouseLeave={() => {
                                if (!rewardsUpdated) { // Возвращаем исходное состояние только если кнопка активна
                                    const btn = document.querySelector('.homeFarmPoints');
                                    btn.style.boxShadow = '0px 0px 20px rgba(255, 0, 255, 0.7), 0px 0px 20px rgba(0, 255, 255, 0.7)';
                                }
                            }}
                        >
                            {!rewardsUpdated ? (
                                'Get ' + farmPoints.toFixed() + ' points'
                            ) : rewardsUpdated ? (
                                <>
                                    <span style={{ position: 'absolute', right: '10px', fontSize: '13px' }}>
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '16px' }}>Farming {farmPoints}</span>
                                </>
                            ) : (
                                'Start Farming'
                            )}
                        </button>
                        )}

                </div>
            </div>
        </SkeletonTheme>
    );
};

export default Home;
