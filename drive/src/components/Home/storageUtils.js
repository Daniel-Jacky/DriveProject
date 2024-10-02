// utils/storageUtils.js

// Сохранение значения в localStorage
export const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  };
  
  // Получение значения из localStorage
  export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage`, error);
      return defaultValue;
    }
  };
  
  // Удаление значения из localStorage
  export const removeFromLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage`, error);
    }
  };
  