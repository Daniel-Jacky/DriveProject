// src/App.js
import React, { useState, useEffect } from 'react';
import { FaTasks } from 'react-icons/fa';
import './List.css';

const List = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const initialRecords = [
      { id: 1, title: 'Drives telegramm chanel', content: '+200 drive points' },
      { id: 2, title: 'Drives instagram', content: '+100 drive points' }
    ];

    setRecords(initialRecords);
  }, []);

  return (
    <div >
      <ul className='coor'>
        {records.map(record => (
          <li key={record.id} >
            
            <div className='listFlex'>
            <FaTasks className="footer-icon"/>
            <div>
            <h4 className='whiteText'>{record.title}</h4>
            <p className='whiteText'>{record.content}</p>
            </div>
            <button className="playBtn">
                Go
            </button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
