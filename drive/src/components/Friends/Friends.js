import React, { useState, useEffect, useRef } from 'react';
import './Friends.css';
import FriendsList from './FriendsList/FriendsList';
import { useUser } from '../UserContext';
import { getInviteLink } from '../api'; // Импортируем функции из api.js
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton'; // Импортируем компоненты из библиотеки скелетонов
import { getUsersFriends } from '../api'; // Импортируем функции из api.js

const Friends = () => {
  const { chatId, setFriendsCount } = useUser();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [isTouching, setIsTouching] = useState(false); // Отслеживаем касание
  const [lastTouchY, setLastTouchY] = useState(0); // Последняя позиция касания
  const [gameLink, setNameLink] = useState(''); // Последняя позиция касания
  const listRef = useRef(null); // Реф для списка друзей

  useEffect(() => {
    const fetchData = async () => {
      const usersLink = await getInviteLink(chatId);
      setNameLink(usersLink)
    };
    fetchData();
  }, [chatId]);


  const inviteFriend = () => {
    const inviteLink = gameLink
    const message = `Привет! Я приглашаю тебя поиграть в Драйв!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const getFriends = await getUsersFriends(chatId); 
    
      for (let i = 0; i < getFriends.length; i++) {
        const elem = getFriends[i];
        if (elem.avatar === null) {
          const avatarUrl = generateAvatar(elem?.username || elem?.firstname);
          elem.avatar = avatarUrl;
        }
      }

      setRecords(getFriends);
      setFriendsCount(getFriends.length);
      setLoading(false);
    };
    fetchData();
  }, [chatId]);

  const generateAvatar = (username, firstname) => {
    if (!username && !firstname){
      return 'https://dummyimage.com/100/cccccc/ffffff.png&text=?';
    } else if (username !== null)
    return `https://ui-avatars.com/api/?name=${username[0].toUpperCase()}&background=random`;
    else if (firstname !== null){
      return `https://ui-avatars.com/api/?name=${firstname[0].toUpperCase()}&background=random`;
    }

  };

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

  return (
    <div className='friends-container'>
      <div className='title'>
        <h2 className='whiteText'>Friends</h2>
        <h7 className='whiteText'>Invite your friends for more Drive points!</h7>
      </div>

      {loading ? (
        <div>
          <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
            <div className="skeletonFriend">
              <Skeleton className="skeletonFriend-icon" />
              <Skeleton className="skeletonFriend-text" />
              <Skeleton className="skeletonFriend-score" />
            </div>
            <Skeleton className="skeletonFriend-button" />
          </SkeletonTheme>
        </div>
      ) : (
        <>
          <div
            className="friends-list"
            ref={listRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <FriendsList records={records} setRecords={setRecords} />
          </div>
          <button className='inviteFrens' onClick={inviteFriend}>
            Invite a friend
          </button>
        </>
      )}
    </div>
  );
};

export default Friends;
