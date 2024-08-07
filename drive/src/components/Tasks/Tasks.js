import React from 'react'
import './Tasks.css';
import List from './TasksList/List';

const Tasks = () => {
  return (
    <div className='tasksBar'>
      <h2 className='whiteText'>Tasks</h2>
      <h7 className='whiteText'>Here will be a text about new tasks</h7>
      <List />
    </div>
  )
}

export default Tasks