import React from 'react';
import './PlayerBubble.css';
import carImage from './Assets/car.png'; // путь к изображению машины

function PlayerBubble({ x, y }) {
    debugger
  return (
    <img
      src={carImage}
      alt="Player Car"
      className="player-car"
      style={{ left: x, top: y }}
    />
  );
}

export default PlayerBubble;
