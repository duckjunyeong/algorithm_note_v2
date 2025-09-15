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
    // Only proceed with checks after Clerk has loaded
    if (!isLoaded) return;

    // Redirect to sign-in if not authenticated
    if (!isSignedIn) {
      navigate(redirectTo);
      return;
    }

    // Redirect if user doesn't have the required role
    if (requiredRole && role !== requiredRole) {
      navigate('/unauthorized'); // You might want to create an unauthorized page
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