import React from 'react'
import PlayButton from './PlayButton/PlayButton'
import ProgressBar from './ProgressBar/ProgressBar';
import './Home.css';

const Home = () => {
  const handleClick = () => {
    alert('Fudge...you are BITCH!!');
  };

  return (
    <div className="App">
      <header>
        <div className="NameAndStat">
        <h2 className='User'> Telegramm User</h2>
        <h2 className='Points'>10.000 Points</h2>
        </div>
      </header>
      <div className="BtnAndBar">
        <PlayButton  onClick={handleClick} className="custom-button">
          Play game
        </PlayButton>
        <ProgressBar/> 
        </div>
    </div>
  )
}

export default Home