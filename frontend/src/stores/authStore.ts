import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  _id?: string;
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
  avatar?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;

  setAuth: (next: { user: AuthUser | null; isAuthenticated?: boolean }) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      setLoading: (v) => set({ loading: v }),
      setAuth: ({ user, isAuthenticated }) =>
        set({
          user,
          isAuthenticated: typeof isAuthenticated === 'boolean' ? isAuthenticated : !!user,
          loading: false,
        }),
      logout: () => set({ user: null, isAuthenticated: false, loading: false }),
    }),
    {
      name: 'collabdocs_auth',
      version: 1,
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

