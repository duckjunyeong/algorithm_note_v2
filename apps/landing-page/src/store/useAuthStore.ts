import { create } from 'zustand';

export interface User {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  publicMetadata: {
    role?: string;
  };
}

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  role: string | null;
}

interface AuthActions {
  setAuthState: (state: Partial<AuthState>) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isLoaded: false,
  isSignedIn: false,
  user: null,
  role: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setAuthState: (newState) =>
    set((state) => {
      const updatedState = { ...state, ...newState };
      // Extract role from user's publicMetadata when user is set
      if (newState.user) {
        updatedState.role = newState.user.publicMetadata?.role || null;
      }
      return updatedState;
    }),

  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
      role: user?.publicMetadata?.role || null,
      isSignedIn: !!user,
    })),

  clearAuth: () => set(initialState),
}));