import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  authError: string | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      authError: null,
      setAuth: (token, user) => set({ token, user, authError: null }),
      clearAuth: () => set({ token: null, user: null }),
      setAuthError: (authError) => set({ authError }),
    }),
    {
      name: 'antigravity-auth-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to survive page reloads but auto-clear on tab close
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist only token and user
    }
  )
);
