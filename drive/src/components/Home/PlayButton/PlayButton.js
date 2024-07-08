import React from 'react'

const PlayButton = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
  )
}

export default PlayButton