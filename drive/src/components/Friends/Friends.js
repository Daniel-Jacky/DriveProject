import React from 'react'
import './Friends.css';
import FriendsList from './FriendsList/FriendsList';

const Friends = () => {

    const inviteFriend = () => {
        const inviteLink = "https://t.me/drive_official_bot?start=invite"; // Замените на свой URL
        const message = `Привет! Я приглашаю тебя поиграть в Драйв! Вот ссылка: ${inviteLink}`;
        
        // Отправка сообщения в Telegram через пользовательский механизм
        // Например, можно использовать Telegram Web App API для отправки сообщения
        window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`);
      };

      
  return (
    <div className='friends-container'>
      <div className='title'>
      <h2 className='whiteText'>Friends</h2>
      <h7 className='whiteText'>Invite your friends for more Drive points!</h7>
      </div>  
      <FriendsList />
      <button className='inviteFrens' onClick={inviteFriend}>Invite a friend</button>
    </div>
  )
}

export default Friends