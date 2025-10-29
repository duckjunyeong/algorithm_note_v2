import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
  
interface UseProtectedRouteProps {
  requiredRole?: string;
  redirectTo?: string;
}

export function useProtectedRoute({
  requiredRole = 'member',
  redirectTo = '/sign-in12'
}: UseProtectedRouteProps = {}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  //const { isLoaded, isSignedIn, role } = useAuthStore();
  console.log("useProtectedRoute - isLoaded:", isLoaded, "isSignedIn:", isSignedIn, "role:", user ? user.publicMetadata.role : null);
  useEffect(() => {

    console.log("isLoaded: " + isLoaded);
    if (!isLoaded) return;

    if (!isSignedIn) {
      window.location.replace(redirectTo);
      return;
    }
    if (requiredRole && user.publicMetadata.role !== requiredRole) {
      navigate('/unauthorized');
      return;
    }
  }, [isLoaded, isSignedIn, user, requiredRole, navigate, redirectTo]);

  const shouldShowContent = isLoaded && isSignedIn && (!requiredRole || user.publicMetadata.role === requiredRole);
  const shouldShowLoading = !isLoaded;

  return {
    shouldShowContent,
    shouldShowLoading,
    isLoaded,
    isSignedIn,
    role : user ? user.publicMetadata.role : null,
  };
}