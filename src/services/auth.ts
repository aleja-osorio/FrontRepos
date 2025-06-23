import { apiService } from './api';
import type { LoginCredentials, User, AuthResponse } from '../types';

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Registrar usuario
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const data = await apiService.post<AuthResponse>('/auth/register', userData);
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Cambiar contraseña
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiService.post('/auth/change-password', passwordData);
  },

  // Recuperar contraseña
  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  },

  // Resetear contraseña
  async resetPassword(resetData: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    await apiService.post('/auth/reset-password', resetData);
  },
}; 