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
  redirectTo = `${import.meta.env.VITE_LANDING_URL}/sign-in`
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