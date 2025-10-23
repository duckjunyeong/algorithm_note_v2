import type { ReactNode } from 'react';

interface ProtectedRouteViewProps {
  children: ReactNode;
  shouldShowContent: boolean;
  shouldShowLoading: boolean;
}

export function ProtectedRouteView({
  children,
  shouldShowContent,
  shouldShowLoading
}: ProtectedRouteViewProps) {
  // Show loading spinner while authentication is being checked
  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Only render children if user is properly authenticated and authorized
  if (shouldShowContent) {
    return <>{children}</>;
  }

  // Return null while redirecting (to prevent flash of content)
  return null;
}