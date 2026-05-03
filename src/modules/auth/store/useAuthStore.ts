import { create } from 'zustand';
import api from '../../../shared/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ticketer' | 'Passenger';
  avatar?: string;
  phone?: string;
  twoFaEnabled?: boolean;
  theme?: 'light' | 'dark' | 'system';
  notifEmail?: boolean;
  notifSms?: boolean;
  notifPush?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: any, rememberMe: boolean) => Promise<User>;
  logout: () => void;
  initialize: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  toggle2FA: (enabled: boolean) => Promise<void>;
  updatePreferences: (prefs: Partial<Pick<User, 'theme' | 'notifEmail' | 'notifSms' | 'notifPush'>>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('tarix_token') || sessionStorage.getItem('tarix_token'),
  isAuthenticated: !!(localStorage.getItem('tarix_token') || sessionStorage.getItem('tarix_token')),
  isInitializing: true,

  login: async (credentials, rememberMe) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...user } = response.data.data;
      
      // Atomic Storage before state update
      if (rememberMe) {
        localStorage.setItem('tarix_token', token);
      } else {
        sessionStorage.setItem('tarix_token', token);
      }
      
      set({ user, token, isAuthenticated: true });
      return user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('tarix_token');
    sessionStorage.removeItem('tarix_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    let token = localStorage.getItem('tarix_token') || sessionStorage.getItem('tarix_token');
    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const response = await api.get('/auth/me');
        set({ user: response.data.data, isAuthenticated: true, isInitializing: false });
      } catch (error) {
        localStorage.removeItem('tarix_token');
        sessionStorage.removeItem('tarix_token');
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
      }
    } else {
      set({ isInitializing: false });
    }
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/profile', data);
    set({ user: response.data.data });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.patch('/users/security/password', { currentPassword, newPassword });
  },

  toggle2FA: async (enabled) => {
    const response = await api.patch('/users/security/2fa', { enabled });
    set({ user: response.data.data });
  },

  updatePreferences: async (prefs) => {
    const response = await api.patch('/users/preferences', prefs);
    set({ user: response.data.data });
  },
}));
