import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/fa'; // Импортируем все иконки
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { SkeletonTheme } from 'react-loading-skeleton'; // Импортируем компоненты из библиотеки скелетонов
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Не забудьте подключить стили для скелетона
import { useUser } from '../../UserContext';
import { getUsersTasks, getCheckUserSubscribe, updateUserScore, updateCompleteTask, getUsersFriends } from '../../api'; // Импортируем функции из api.js
import './List.css';

const List = () => {
  const [records, setRecords] = useState([]);
  const { chatId, gamesLeft, setScore, localSaveScore, setLocalSaveScore, friendsCount, setFriendsCount, totalFarm } = useUser();
  const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки данных
  const [isTaskLoading, setIsTaskLoading] = useState(false); // Состояние для спиннера задачи

  useEffect(() => {
    const fetchData = async () => {
      const getUserTasks = await getUsersTasks(chatId); // Получаем данные пользователя
      setRecords(getUserTasks);
      console.log(getUserTasks)
      const getFriends = await getUsersFriends(chatId)
      setFriendsCount(getFriends.length)
      setIsLoading(false); // Отключаем загрузку после получения данных
    };
    fetchData();
  }, [chatId]);

  const checkTask = async (id) => {
    setIsTaskLoading(true);  // Запускаем спиннер задачи

    const record = records.find(item => item.id === id);
    let isCompleted = '',
        newScore = 0;
    if (record.reason === "subscribeHuch") {
      const getInfoFromTask = await getCheckUserSubscribe(chatId); // Выполнение задачи
      if (getInfoFromTask === 'Subbed') {
          newScore = Number(localSaveScore) + record.points;
        isCompleted = true;

        await updateUserScore(chatId, newScore, gamesLeft);
        await updateCompleteTask(id, isCompleted);

        // Обновляем состояние записей после выполнения задачи
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, isCompleted: true } : record
          )
        );

        setScore(newScore);
        setLocalSaveScore(newScore);
      } else {
        window.open(`https://t.me/alldrivecrypto`);
      }
    } else if (record.reason === "farm3000") {
      if (Number(totalFarm) >= 3000) {
        isCompleted = true;
        newScore = Number(localSaveScore) + record.points;
        await updateCompleteTask(id, isCompleted);
        await updateUserScore(chatId, newScore, gamesLeft, totalFarm);
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, isCompleted: true } : record
          )
        );
        } 
      } else if (record.reason === "addFriends") {
        if (Number(friendsCount) >= 3) {
          isCompleted = true;
          newScore = Number(localSaveScore) + record.points;
          await updateCompleteTask(id, isCompleted);
          await updateUserScore(chatId, newScore, gamesLeft, totalFarm);
          setRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.id === id ? { ...record, isCompleted: true } : record
            )
          );
          } 
        }

    setIsTaskLoading(false);  // Останавливаем спиннер после завершения
  };

  const renderSkeleton = () => (
    <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
      <div className="skeleton">
        <div>
          <Skeleton className="skeleton-icon" />
        </div>
        <Skeleton className="skeleton-text" />
        <div>
          <Skeleton className="skeleton-button" />
        </div>
      </div>
    </SkeletonTheme>
  );

  return (
    <div>
      {isLoading ? (
        // Рендерим фиксированное количество скелетонов
        <ul className="coor">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              {renderSkeleton()}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="coor">
          {records.map((record) => {
            const IconComponent = Icons[record.icon]; // Динамически выбираем компонент иконки
            return (
              <li key={record.id}>
                <div className="listFlex">
                  <div className="iconAndTask">
                    {IconComponent && <IconComponent className="footer-icon" />} {/* Рендерим иконку */}
                    <div className="tasksText">
                      <h5 className="whiteText">{record.title}</h5>
                      <h5 className="whiteText">{record.content}</h5>
                      <h5 className="whiteText">+{record.points} Drive points</h5>
                    </div>
                  </div>
                  <button
                    className={`playBtn ${record.isCompleted ? 'completed' : ''}`}
                    onClick={() => checkTask(record.id)}
                    disabled={record.isCompleted} // Блокируем кнопку, если задача выполнена
                  >
                    {(isTaskLoading && record.isCompleted) ? (
                      <FaSpinner className="spinnerBtn" />
                    ) : record.isCompleted ? (
                      <FaCheck />
                    ) : record.reason === 'farm3000' ? (
                      `${totalFarm >= 3000 ? 3000 : totalFarm}/3000`
                    ) : record.reason === 'addFriends' ? (
                      `${friendsCount >= 3 ? 3 : friendsCount}/3`
                    ) : (
                      'Start'
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default List;
