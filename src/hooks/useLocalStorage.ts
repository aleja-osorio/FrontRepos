import { useState, useEffect } from 'react';

// Hook personalizado para manejar localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  // Pasa la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para establecer el valor en localStorage y en el estado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guarda en el estado
      setStoredValue(valueToStore);
      
      // Guarda en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Función para eliminar el valor de localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Hook para manejar el tema (dark/light mode)
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}

// Hook para manejar preferencias de usuario
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('user-preferences', {
    language: 'es',
    currency: 'USD',
    notifications: true,
    autoSave: true,
  });

  const updatePreference = (key: string, value: unknown) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return { preferences, setPreferences, updatePreference };
}

// Hook para manejar historial de navegación
export function useNavigationHistory() {
  const [history, setHistory] = useLocalStorage<string[]>('navigation-history', []);

  const addToHistory = (path: string) => {
    setHistory(prev => {
      const newHistory = [path, ...prev.filter(p => p !== path)].slice(0, 10);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
} 