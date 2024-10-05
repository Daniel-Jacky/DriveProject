// src/App.js
import React, { useState, useEffect } from 'react';
import { FaTasks, FaTelegramPlane,FaInstagram } from 'react-icons/fa';
import { useUser } from '../../UserContext';
import { getCheckUserSubscribe} from '../../api'; // Импортируем функции из api.js

import './List.css';

const List = () => {
  const [records, setRecords] = useState([]);
  const { chatId } = useUser();

  const checkTask = async () => {
    await getCheckUserSubscribe(chatId); // Обновляем очки
  };

  useEffect(() => {
    const initialRecords = [
      { id: 1, icon: FaTelegramPlane , title: 'Drives telegram chanel', content: '+200 drive points' },
      { id: 2, icon: FaInstagram, title: 'Drives instagram', content: '+100 drive points' }
    ];

    setRecords(initialRecords);
  }, []);

  return (
    <div >
      <ul className='coor'>
        {records.map(record => (
          <li key={record.id} >

            <div className='listFlex'>
              <div className='iconAndTask'>
              <record.icon className="footer-icon" />
                <div className='tasksText'>
                  <h5 className='whiteText'>{record.title}</h5>
                  <h5 className='whiteText'>{record.content}</h5>
                </div>
              </div>
              <button className="playBtn" onClick={checkTask}>
                Start
              </button>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
