import { create } from 'zustand';
import { User } from '@meetmates/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: (user: User) => {
    set({ user, isAuthenticated: true, isLoading: false });
    localStorage.setItem('meetmates_user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
    // Remove any stored user/session data
    try {
      localStorage.removeItem('meetmates_user');
      // Remove any other app-specific keys if added later
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('meetmates_')) keysToRemove.push(key);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}

    try {
      // Clear session storage fully to avoid cross-login residue
      sessionStorage.clear();
    } catch {}
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      localStorage.setItem('meetmates_user', JSON.stringify(updatedUser));
    }
  },

  checkAuth: async () => {
    try {
      const storedUser = localStorage.getItem('meetmates_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        
        // Try to fetch fresh user data from database
        try {
          const freshUser = await api.getUser(user.id);
          set({ user: freshUser, isAuthenticated: true, isLoading: false });
          localStorage.setItem('meetmates_user', JSON.stringify(freshUser));
        } catch (error) {
          // If API call fails, use stored user data
          console.warn('Failed to fetch fresh user data, using stored data:', error);
          set({ user, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
