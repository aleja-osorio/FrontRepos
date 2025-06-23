import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../utils/constants';

// Configuración base para las llamadas a la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar datos de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Funciones helper para métodos HTTP comunes
export const apiService = {
  get: <T = unknown>(endpoint: string, config?: AxiosRequestConfig) => 
    api.get<T>(endpoint, config).then((response: AxiosResponse<T>) => response.data),
  
  post: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.post<T>(endpoint, data, config).then((response: AxiosResponse<T>) => response.data),
  
  put: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.put<T>(endpoint, data, config).then((response: AxiosResponse<T>) => response.data),
  
  delete: <T = unknown>(endpoint: string, config?: AxiosRequestConfig) => 
    api.delete<T>(endpoint, config).then((response: AxiosResponse<T>) => response.data),
  
  patch: <T = unknown>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) => 
    api.patch<T>(endpoint, data, config).then((response: AxiosResponse<T>) => response.data),
};

// Exportar la instancia de axios para casos especiales
export default api; 