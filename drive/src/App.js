import "./App.css";
import React, { useState } from "react";
import Footer from "./components/Footer/Footer";
import Game from "./components/Home/Game";
import Home from "./components/Home/Home";
import Tasks from "./components/Tasks/Tasks";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Friends from "./components/Friends/Friends";

function App() {
  const [dataFromChild, setDataFromChild] = useState(false);
    
  const handleDataFromChild = (data) => {
    console.log("Data received from child:", data);
    setDataFromChild(data); // Обновляем состояние в родительском компоненте
  };
  return (
    <Router>
      <div className="Main">
        <Routes>
          <Route path="/" element={<Home onGameStatus={handleDataFromChild} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/game" element={<Game onGameStatus={handleDataFromChild}/>} />
        </Routes>
        {!dataFromChild && <Footer />}
      </div>
    </Router>
  );

  // Подключите в терминале "npm install react-router-dom" и "npm install react-icons"
  //Фуджила 
}

export default App;
