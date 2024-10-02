// src/components/api.js
import axios from 'axios';

const API_URL = 'https://fudg-test2.ru/users';

// Функция для получения данных пользователей
export const fetchUserData = async () => {
    try {
        const response = await axios.get(API_URL);
        
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};

// Функция для получения текущего пользователя по chatId
export const getUserByChatId = (data, chatId) => {
    return data.find(user => user.chatId === chatId) || null; // Ищем пользователя по chatId
};

// Функция для обновления очков пользователя
export const updateUserScore = async (chatId, newScore) => {
    try {
        const response = await axios.put(`${API_URL}/${chatId}`, {
            score: newScore,
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};
