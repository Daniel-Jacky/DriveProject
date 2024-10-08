import React, { useState, useEffect } from 'react';
import './Friends.css';
import FriendsList from './FriendsList/FriendsList';
import { useUser } from '../UserContext';
import { getInviteLink } from '../api'; // Импортируем функции из api.js
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton'; // Импортируем компоненты из библиотеки скелетонов

const Friends = () => {
  const { chatId } = useUser();
  const [loading, setLoading] = useState(true); // Добавим состояние загрузки

  const inviteFriend = async () => {
    const gameLink = await getInviteLink(chatId);
    const message = `Привет! Я приглашаю тебя поиграть в Драйв!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(gameLink)}&text=${encodeURIComponent(message)}`);
  };

  // Симуляция загрузки
  useEffect(() => {
    setTimeout(() => {
     // Через 2 секунды данные загружены
     setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className='friends-container'>
      <div className='title'>
        <h2 className='whiteText'>Friends</h2>
        <h7 className='whiteText'>Invite your friends for more Drive points!</h7>
      </div>

      {loading ? (
        // Показываем skeleton, пока данные загружаются
        <div>
    <SkeletonTheme baseColor="#8b8b8b" highlightColor="#f0f0f0">
      <div className="skeletonFriend">
        <div>
          <Skeleton className="skeletonFriend-icon" />
        </div>
        <Skeleton className="skeletonFriend-text" />
        <div>
        <Skeleton className="skeletonFriend-score" />
        </div>
      </div>
      <Skeleton className="skeletonFriend-button" />
    </SkeletonTheme>
        </div>
      ) : (
        // Отображаем список друзей после загрузки
        <>
            <FriendsList loading={loading} setLoading={setLoading}/>
            <button className='inviteFrens' onClick={inviteFriend}>
              Invite a friend
            </button></>
      )}
    </div>
  );
};

export default Friends;
