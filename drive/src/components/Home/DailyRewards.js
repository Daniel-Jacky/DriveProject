import React from 'react'
import './DailyRewards.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { updateUserScore} from '../api'; // Импортируем функции из api.js

const DailyRewards = () => {
    const navigate = useNavigate();
    const { currentStreak, setCheckRewards } = useUser();

    const confirmRewards = async () => {
        navigate('/'); // Перенаправляем на главную страницу
        setCheckRewards(true) 
      };

      

    return (
<div className="container">
    <h2 className='mrgH2'>Good job, Driver!</h2>
    <h2 className='mrgH2'>Here's your daily bonus</h2>
    <h3 className='mrgPoints'>{(Number(currentStreak) === 0 ? 1 : Number(currentStreak))  * 10} Drive points</h3>
    <h3 className='margGamesLeft'>{Number(currentStreak) + 3} play passes</h3>

    <button className='continueBtn' onClick={confirmRewards} >Continue</button>
</div>

    )
}

export default DailyRewards