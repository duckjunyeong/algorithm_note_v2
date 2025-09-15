import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { User } from '../../store/useAuthStore';

export function useAuthProvider() {
  const { isLoaded: clerkIsLoaded, isSignedIn: clerkIsSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { setAuthState, setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    // Sync Clerk auth state with Zustand store
    setAuthState({
      isLoaded: clerkIsLoaded,
      isSignedIn: clerkIsSignedIn,
    });

    if (clerkIsLoaded) {
      if (clerkIsSignedIn && clerkUser) {
        // Transform Clerk user to our User interface
        const user: User = {
          id: clerkUser.id,
          emailAddress: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          imageUrl: clerkUser.imageUrl || undefined,
          publicMetadata: {
            role: clerkUser.publicMetadata?.role as string | undefined,
          },
        };
        setUser(user);
      } else {
        clearAuth();
      }
    }
  }, [clerkIsLoaded, clerkIsSignedIn, clerkUser, setAuthState, setUser, clearAuth]);

  return {
    isLoaded: clerkIsLoaded,
  };
}