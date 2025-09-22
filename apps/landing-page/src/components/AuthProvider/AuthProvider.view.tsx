import type { ReactNode } from 'react';

interface AuthProviderViewProps {
  children: ReactNode;
  isLoaded: boolean;
}

export function AuthProviderView({ children, isLoaded }: AuthProviderViewProps) {
  // Show loading indicator while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}