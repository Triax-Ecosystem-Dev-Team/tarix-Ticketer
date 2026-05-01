import { create } from 'zustand';
import api from '../../../shared/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ticketer' | 'Passenger';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: any, rememberMe: boolean) => Promise<User>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  isAuthenticated: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),
  isInitializing: true,

  login: async (credentials, rememberMe) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...user } = response.data.data;
      
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      set({ user, token, isAuthenticated: true });
      return user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        set({ user: response.data.data, isAuthenticated: true, isInitializing: false });
      } catch (error) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
      }
    } else {
      set({ isInitializing: false });
    }
  }
}));
