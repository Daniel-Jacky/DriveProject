import React from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

const PlayButton = ({ onClick, children, className }) => {

  const { gamesLeft } = useUser();
  return (

<Link to="/game" >
<button onClick={onClick} className={`button ${className}`} disabled={gamesLeft <= 0}>
    {children}
  </button>
</Link>
  )
}

export default PlayButton