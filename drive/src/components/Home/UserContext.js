import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Статичные данные
    const [username, setUsername] = useState('');
    const [chatId, setChatId] = useState('');
    const [avatar, setAvatar] = useState('');

    // Динамичные данные
    const [score, setScore] = useState(0);

    return (
        <UserContext.Provider value={{ username, setUsername, chatId, setChatId, score, setScore, avatar, setAvatar}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
