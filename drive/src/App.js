import "./App.css";
import React, { useEffect, useState } from "react";
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
    localStorage.setItem('gameActive', JSON.stringify(data)); // Сохраняем состояние в localStorage
  };

  useEffect(() => {
    // Восстанавливаем состояние из localStorage при загрузке страницы
    const savedGameActive = JSON.parse(localStorage.getItem('gameActive'));
    if (savedGameActive !== null) {
      setDataFromChild(savedGameActive);
    }

    // Проверяем доступность Telegram Web App API и разворачиваем приложение
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand(); // Разворачиваем приложение на весь экран
    } else {
      console.error('Telegram Web App API не доступен');
    }
  }, []);

  return (
    <Router>
      <div className="Main">
        <Routes>
          <Route path="/" element={<Home onGameStatus={handleDataFromChild} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/game" element={<Game onGameStatus={handleDataFromChild} />} />
        </Routes>
        {!dataFromChild && <Footer />} {/* Показываем футер только если игра не активна */}
      </div>
    </Router>
  );
}

export default App;
