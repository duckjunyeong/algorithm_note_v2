import type { ReactNode } from 'react';
import { useProtectedRoute } from './useProtectedRoute';
import { ProtectedRouteView } from './ProtectedRoute.view';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole = 'member',
  redirectTo = 'http://localhost:5174/sign-in'
}: ProtectedRouteProps) {
  const { shouldShowContent, shouldShowLoading } = useProtectedRoute({
    requiredRole,
    redirectTo
  });

  return (
    <ProtectedRouteView
      shouldShowContent={shouldShowContent}
      shouldShowLoading={shouldShowLoading}
    >
      {children}
    </ProtectedRouteView>
  );
}