import { create } from 'zustand';
import { User } from '@meetmates/types';

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
    localStorage.removeItem('meetmates_user');
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
        // In a real app, you'd validate the token here
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
