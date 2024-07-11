import React from 'react';
import './PlayerBubble.css';
import carImage from './Assets/car.png'; // путь к изображению машины

function PlayerBubble({ x, y }) {
    
  return (
    <img
      src={carImage}
      alt="Player Car"
      className="player-car"
      style={{ left: x, top: y }}
    />
    // <div className="player-bub" style={{top: y, left: x}}></div>
  );
}

export default PlayerBubble;
