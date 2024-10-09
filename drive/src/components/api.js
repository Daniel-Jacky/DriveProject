// src/components/api.js
import axios from 'axios';

const API_URL            = 'https://fudg-test2.ru/users',
      API_TASK_URL       = 'https://fudg-test2.ru/users',
      API_TASK_CHECK_URL = 'https://fudg-test2.ru/taskcheck/goida/',
      API_UPDATE_TASK    = 'https://fudg-test2.ru/users/tasks',
      API_REF_FRIEND     = 'https://fudg-test2.ru/user/reg',
      API_FRIENDS_LIST   = 'https://fudg-test2.ru//friends',
      API_INVITE_FRIEND  = 'https://fudg-test2.ru/invites';

// Функция для получения данных пользователя по chatId
export const getUserByChatId = async (chatId) => {
    try {  
        const response = await axios.get(`${API_URL}/${chatId}`);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

// Функция для обновления очков пользователя
export const updateUserScore = async (chatId, newScore, newGamesLeft, newTotalFarm) => {
    try {
        const response = await axios.put(`${API_URL}/${chatId}`, {
            score: newScore,
            gamesLeft: newGamesLeft,
            totalFarm: newTotalFarm
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const updateUserTimeGamesAdded = async (chatId, newGamesLeft, currentStreak, newLastTimeGamesAdded, updatedToday) => {
    try {
        const response = await axios.put(`${API_URL}/${chatId}`, {
            gamesLeft: newGamesLeft,
            currentStreak: currentStreak,
            lastTimeGamesAdded: newLastTimeGamesAdded,
            updatedToday: updatedToday
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const getUsersTasks = async (chatId) => {
    try {  
        const response = await axios.get(`${API_TASK_URL}/${chatId}/tasks/`);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const getCheckUserSubscribe = async (chatId) => {
    try {  
        const response = await axios.get(`${API_TASK_CHECK_URL}/${chatId}`);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const updateCompleteTask = async (id, isCompleted) => {
    try {
        const response = await axios.put(`${API_UPDATE_TASK}/${id}`, {
            isCompleted: isCompleted
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const addRefFriend = async (chatId, firstname, lastname, username, avatarUrl, friendUrl) => {
    try {
        const response = await axios.post(`${API_REF_FRIEND}`, {
            chtId: chatId,
            name: firstname,
            lastname: lastname,
            username: username,
            avatarUrl: avatarUrl,
            friendUrl: friendUrl
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const getUsersFriends = async (chatId) => {
    try {  
        const response = await axios.get(`${API_FRIENDS_LIST}/${chatId}`);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const getInviteLink = async (chatId) => {
    try {  
        const response = await axios.get(`${API_INVITE_FRIEND}/${chatId}`);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};