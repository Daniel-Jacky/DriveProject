import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Инициализируем состояния из localStorage, если данные там есть
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [chatId, setChatId] = useState(localStorage.getItem('chatId') || '');
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
    const [gamesLeft, setGamesLeft] = useState(localStorage.getItem('gamesLeft') || '');
    const [currentStreak, setCurrentStreak] = useState(localStorage.getItem('currentStreak') || '');
    const [lastTimeGamesAdded, setLastTimeGamesAdded] = useState(localStorage.getItem('lastTimeGamesAdded') || '');
    const [updatedToday, setUpdatedToday] = useState(localStorage.getItem('updatedToday') || '');
    const [checkRewards, setCheckRewards] = useState(localStorage.getItem('checkRewards') || '');


    // Динамичные данные, которые не обязательно сохранять в localStorage
    const [score, setScore] = useState(0);

    // Используем useEffect, чтобы обновлять localStorage при изменении значений
    useEffect(() => {
        if (chatId) {
            localStorage.setItem('chatId', chatId);
        }
    }, [chatId]);

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    useEffect(() => {
        if (avatar) {
            localStorage.setItem('avatar', avatar);
        }
    }, [avatar]);

    useEffect(() => {
        if (gamesLeft) {
            localStorage.setItem('gamesLeft', gamesLeft);
        }
    }, [gamesLeft]);

    useEffect(() => {
        if (currentStreak) {
            localStorage.setItem('currentStreak', currentStreak);
        }
    }, [currentStreak]);

    useEffect(() => {
        if (lastTimeGamesAdded) {
            localStorage.setItem('lastTimeGamesAdded', lastTimeGamesAdded);
        }
    }, [lastTimeGamesAdded]);

    useEffect(() => {
        if (updatedToday) {
            localStorage.setItem('updatedToday', updatedToday);
        }
    }, [updatedToday]);

    useEffect(() => {
        if (checkRewards) {
            localStorage.setItem('checkRewards', checkRewards);
        }
    }, [checkRewards]);



    return (
        <UserContext.Provider value={{ username, setUsername, chatId, setChatId, score, setScore, avatar, setAvatar,
         gamesLeft, setGamesLeft, currentStreak, setCurrentStreak, lastTimeGamesAdded, setLastTimeGamesAdded, 
         updatedToday, setUpdatedToday, checkRewards, setCheckRewards }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
