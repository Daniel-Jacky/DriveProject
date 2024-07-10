
import './App.css';
import React, { useState } from 'react';
import Footer from './components/Footer/Footer';
import Game from './components/Home/Game';
import Home from './components/Home/Home';
import Tasks from './components/Tasks/Tasks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  
  const [dataFromChild, setDataFromChild] = useState(false);

  const handleDataFromChild = (data) => {
    console.log('Data received from child:', data);
    setDataFromChild(data); // Обновляем состояние в родительском компоненте
  };
  return (
    <Router>
      <div className='Main'>
        <Routes>
          <Route path="/" element={<Home onData={handleDataFromChild}/>} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/game" element={<Game />} />
        </Routes>
        {!dataFromChild && (<Footer />)}
      </div>
      
    </Router>
  );

  // Подключите в терминале "npm install react-router-dom" и "npm install react-icons"
  //Хуй
 
}

export default App;
