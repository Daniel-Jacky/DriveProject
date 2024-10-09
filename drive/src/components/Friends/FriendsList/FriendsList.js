import React, { useState, useEffect } from 'react';
import './FriendsList.css';

const FriendsList = ({ records }) => {

  const sortedRecords = [...records].sort((a, b) => b.score - a.score);
console.log(sortedRecords)

  return (
    <div>
      <ul className='coor'>
        <h6 className='countFriends'>
          {records.length} {sortedRecords.length <= 1 ? 'Friend' : 'Friends'}
        </h6>
        {sortedRecords.map(record => (
          <li key={record.id}>
            <div className='listFlex'>
              <div className='iconAndTask'>
                <img src={record.avatar} alt="User Avatar" className="friends-avatar" />
                <div className='tasksText'>
                  <h5 className='whiteText'>{record.username.length <= 1 ? record.firstname : record.username}</h5> {/* Display friend's name */}
                </div>
              </div>
              <h5 className='frensPoints'>{record.score} D</h5> {/* Display friend's points */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;