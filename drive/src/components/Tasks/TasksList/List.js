import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/fa'; // Импортируем все иконки
import { FaCheck } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from '../../UserContext';
import { getUsersTasks, getCheckUserSubscribe, updateUserScore, updateCompleteTask } from '../../api'; // Импортируем функции из api.js
import './List.css';

const List = () => {
  const [records, setRecords] = useState([]);
  const { chatId, gamesLeft, setScore, localSaveScore, setLocalSaveScore } = useUser();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Состояние для спиннера

  useEffect(() => {
    const fetchData = async () => {
      const getUsers = await getUsersTasks(chatId); // Получаем данные пользователя
      setRecords(getUsers);
      console.log(getUsers)
    };
    fetchData();
  }, [chatId]);

  const checkTask = async (id) => {
    setIsLoading(true);  // Запускаем спиннер

    const record = records.filter(item => item.id === id)
    let isCompleted = ''
    if (record[0].reason === "subscribeHuch") {
      const getInfoFromTask = await getCheckUserSubscribe(chatId); // Выполнение задачи
          if (getInfoFromTask === 'Subbed') {
            let newScore = '';
             isCompleted = true;
            for (let i = 0; i < records.length; i++) {
              if (id === records[i].id) {
                newScore = Number(localSaveScore) + records[i].points;
              }
            }
      
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
            window.open(`https://t.me/hoochYou`);
      } 

    } else if (record[0].reason === "farm3000"){
      if (Number(localSaveScore) === 3000) {
        isCompleted = true;
        await updateCompleteTask(id, isCompleted);
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, isCompleted: true } : record
          )
        )
      }
    }


  setIsLoading(false);  // Останавливаем спиннер после завершения

  };
  

  return (
    <div>
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
                  </div>
                </div>
                <button
                  className={`playBtn ${record.isCompleted ? 'completed' : ''}`}
                  onClick={() => checkTask(record.id)}
                  disabled={record.isCompleted} // Блокируем кнопку, если задача выполнена
                >
                 {(isLoading && record.isCompleted) ? (
                  <FaSpinner className="spinnerBtn" />
                ) : record.isCompleted ? (
                  <FaCheck />
                ) : record.reason === 'farm3000' ? (
                  `${localSaveScore}/3000`
                ) : (
                  'Start'
                )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default List;
