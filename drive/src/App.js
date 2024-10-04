import "./App.css";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer";
import Game from "./components/Home/Game";
import Home from "./components/Home/Home";
import Tasks from "./components/Tasks/Tasks";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Friends from "./components/Friends/Friends";

function App() {
  const [gameIsActive, setGameIsActive] = useState(true);
  const [isLoadingHomeScreen, setIsLoadingHomeScreen] = useState(true); // Состояние загрузки домашнего экрана
    
  const handleDataFromChild = (data) => {
    console.log("Data received from child:", data);
    setGameIsActive(data); // Обновляем состояние в родительском компоненте
    localStorage.setItem('gameActive', JSON.stringify(data)); // Сохраняем состояние в localStorage
  };

  useEffect(() => {
    // Восстанавливаем состояние из localStorage при загрузке страницы
    const savedGameActive = JSON.parse(localStorage.getItem('gameActive'));
    if (savedGameActive !== null) {
      setGameIsActive(savedGameActive);
    }

    // Проверяем доступность Telegram Web App API и разворачиваем приложение
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand(); // Разворачиваем приложение на весь экран
    } else {
      console.error('Telegram Web App API не доступен');
    }
    setTimeout(() => {
      setIsLoadingHomeScreen(false); // Останавливаем загрузку через 3 секунды
  }, 2000);
  }, []);

  if (isLoadingHomeScreen) {
    // Передаем статус загрузочного экрана родителю
    return (
        <div className="loading-screen">
            <div className="spinner"></div>
        </div>
    );
}
  

  return (
    <Router>
      <div className="Main">
        <Routes>
          <Route path="/" element={<Home onGameStatus={handleDataFromChild} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/game" element={<Game onGameStatus={handleDataFromChild} />} />
        </Routes>
        {!gameIsActive && <Footer />} {/* Показываем футер только если игра не активна */}
      </div>
    </Router>
  );
}

export default App;
