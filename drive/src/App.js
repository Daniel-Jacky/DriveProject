import "./App.css";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer/Footer";
import Game from "./components/Home/Game";
import Home from "./components/Home/Home";
import Tasks from "./components/Tasks/Tasks";
import { HashRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Friends from "./components/Friends/Friends";
import DailyRewards from "./components/Home/DailyRewards";

// Компонент для управления маршрутизацией и состояниями
const MainApp = ({ }) => {
  const location = useLocation(); // Вызываем useLocation внутри компонента, который обёрнут в Router

  return (
    <div className="Main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/game" element={<Game />} />
        <Route path="/rewards" element={<DailyRewards />} />
      </Routes>
      {(location.pathname !== '/game' && location.pathname !== '/rewards') && <Footer />} {/* Футер не показываем на странице /game */}
    </div>
  );
}

function App() {
  const [isLoadingHomeScreen, setIsLoadingHomeScreen] = useState(true); // Состояние загрузки домашнего экрана
    
  const handleDataFromChild = (data) => {
    console.log("Data received from child:", data);
    localStorage.setItem('gameActive', JSON.stringify(data)); // Сохраняем состояние в localStorage
  };

  useEffect(() => {
    // Проверяем доступность Telegram Web App API и разворачиваем приложение
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand(); // Разворачиваем приложение на весь экран
    } else {
      console.error('Telegram Web App API не доступен');
    }
    setTimeout(() => {
      setIsLoadingHomeScreen(false); // Останавливаем загрузку через 2 секунды
    }, 2000);
  }, []);

  if (isLoadingHomeScreen) {
    // Показываем экран загрузки
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <MainApp handleDataFromChild={handleDataFromChild} /> {/* Обёрнутый в Router компонент */}
    </Router>
  );
}

export default App;
