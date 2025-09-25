import type { ReactNode } from 'react';
import { useAuthProvider } from './useAuthProvider';
import { AuthProviderView } from './AuthProvider.view';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded } = useAuthProvider();

  return <AuthProviderView isLoaded={isLoaded}>{children}</AuthProviderView>;
}