import React from 'react'
import './Tasks.css';
import List from './TasksList/List';

const Tasks = () => {
  return (
    <div className='tasksBar'>
      <div className='title'>
      <h2 className='whiteText'>Tasks</h2>
      <h7 className='whiteTextTitle'>Life in Drive City is no simple task.</h7>
      <h7 className='whiteTextTitle'>These tasks, however, will make it easier...</h7>
      </div>   
      <List />
    </div>
  )
}

export default Tasks