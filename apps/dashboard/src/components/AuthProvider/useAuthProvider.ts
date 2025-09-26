import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { User } from '../../store/useAuthStore';


// 최신화된 데이터가 아닌 브라우저에 저장된 데이터를 가공한다.
export function useAuthProvider() {
  const { isLoaded: clerkIsLoaded, isSignedIn: clerkIsSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { setAuthState, setUser, clearAuth, isLoaded } = useAuthStore();

  useEffect(() => {
    console.log("In useAuthProvider: isLoaded " + isLoaded);
    setAuthState({
      isLoaded: clerkIsLoaded,
      isSignedIn: clerkIsSignedIn,
    });

    if (clerkIsLoaded) {
      if (clerkIsSignedIn && clerkUser) {
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
          setAuthState({
            isLoaded: true,
            isSignedIn: false,
          });
      }
    }
  }, [clerkIsLoaded, clerkIsSignedIn, clerkUser, setAuthState, setUser, clearAuth]);

  return {
    isLoaded: clerkIsLoaded,
  };
}