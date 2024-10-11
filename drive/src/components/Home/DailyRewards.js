import React from 'react'
import './DailyRewards.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const DailyRewards = () => {
    const navigate = useNavigate();
    const { currentStreak, setCheckRewards, gamesLeft } = useUser();

    const confirmRewards = () => {
       
        navigate('/'); // Перенаправляем на главную страницу
        setCheckRewards(true)
      };

      

    return (
<div className="container">
    <h2 className='mrgH2'>Your daily rewards</h2>
    <h3 className='mrgPoints'>{(Number(currentStreak) === 0 ? 1 : Number(currentStreak))  * 10} Drive points</h3>
    <h3 className='margGamesLeft'>{Number(currentStreak) + 3} play passes</h3>

    <button className='continueBtn' onClick={confirmRewards} >Continue</button>
</div>

    )
}

export default DailyRewards