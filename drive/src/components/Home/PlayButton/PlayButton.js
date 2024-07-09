import React from 'react'
import { Link } from 'react-router-dom';

const PlayButton = ({ onClick, children, className }) => {
  return (

<Link to="/game" >
<button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
</Link>
  )
}

export default PlayButton