import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Инициализируем состояния из localStorage, если данные там есть
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [chatId, setChatId] = useState(localStorage.getItem('chatId') || '');
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
    const [gamesLeft, setGamesLeft] = useState(localStorage.getItem('gamesLeft') || '');

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

    return (
        <UserContext.Provider value={{ username, setUsername, chatId, setChatId, score, setScore, avatar, setAvatar, gamesLeft, setGamesLeft }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
