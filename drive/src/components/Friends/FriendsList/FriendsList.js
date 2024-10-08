import React, { useState, useEffect } from 'react';
import './FriendsList.css';
import { FaTasks, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import { getUsersFriends } from '../../api'; // Импортируем функции из api.js
import { useUser } from '../../UserContext';


const FriendsList = ({ loading, setLoading }) => {
  const [records, setRecords] = useState([]);

  const { chatId, setFriendsCount } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const getFriends = await getUsersFriends(chatId); // Получаем данные пользователя
      console.log(getFriends)
      for (let i = 0; i < getFriends.length; i++) {
        const elem = getFriends[i];
        if (elem.avatar === null) {
          const avatarUrl = generateAvatar(elem?.username || elem?.firstname);
          elem.avatar = avatarUrl
        }

      }

      setRecords(getFriends)
      setFriendsCount(getFriends.length)
      setLoading(false);
    };
    fetchData();
  }, [chatId]);

  const generateAvatar = (username) => {
    if (!username) return 'https://dummyimage.com/100/cccccc/ffffff.png&text=?';
    return `https://ui-avatars.com/api/?name=${username[0].toUpperCase()}&background=random`;
  };

  return (
    <div>
      <ul className='coor'>
        <h6 className='countFriends'>
          {records.length} {records.length <= 1 ? 'Friend' : 'Friends'}
        </h6>
        {records.map(record => (
          <li key={record.id}>
            <div className='listFlex'>
              <div className='iconAndTask'>
                <img src={record.avatar} alt="User Avatar" className="friends-avatar" />
                <div className='tasksText'>
                  <h5 className='whiteText'>{record.username}</h5> {/* Display friend's name */}
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