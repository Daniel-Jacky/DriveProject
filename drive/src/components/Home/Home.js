import React from 'react'
import PlayButton from './PlayButton/PlayButton'
import ProgressBar from './ProgressBar/ProgressBar';

const Home = () => {
  const handleClick = () => {
    alert('Fudge...you are BITCH!!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2 className='User'> Telegramm User</h2>
        <h1 className='Points'>10.000 Points</h1>
        <div className='BtnAndBar'>
        <PlayButton  onClick={handleClick} className="custom-button">
          Play game
        </PlayButton>
        <ProgressBar duration={10} /> {/* 10 секунд на полный прогресс */}
        </div>
      </header>
    </div>
  )
}

export default Home