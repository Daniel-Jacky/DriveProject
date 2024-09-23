import React, { useState, useEffect } from 'react';
import './FriendsList.css';
import { FaTasks, FaTelegramPlane,FaInstagram } from 'react-icons/fa';

const FriendsList = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
      const initialRecords = [
        { id: 1,  name: 'Alex', points: '180 DP' },
        { id: 2,  name: 'Sandy', points: '250 DP' }
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
                  <div className='tasksText'>
                    <h5 className='whiteText'>{record.name}</h5>
                  </div>
                </div>
                <h5 className='frensPoints'>{record.points}</h5>
              </div>
  
            </li>
          ))}
        </ul>
      </div>
    );
}

export default FriendsList