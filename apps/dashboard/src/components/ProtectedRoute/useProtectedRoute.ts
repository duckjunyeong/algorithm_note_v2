import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface UseProtectedRouteProps {
  requiredRole?: string;
  redirectTo?: string;
}

export function useProtectedRoute({
  requiredRole = 'member',
  redirectTo = '/sign-in'
}: UseProtectedRouteProps = {}) {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, role } = useAuthStore();
  
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate(redirectTo);
      return;
    }

    if (requiredRole && role !== requiredRole) {
      navigate('/unauthorized');
      return;
    }
  }, [isLoaded, isSignedIn, role, requiredRole, navigate, redirectTo]);

  const shouldShowContent = isLoaded && isSignedIn && (!requiredRole || role === requiredRole);
  const shouldShowLoading = !isLoaded;

  return {
    shouldShowContent,
    shouldShowLoading,
    isLoaded,
    isSignedIn,
    role,
  };
}