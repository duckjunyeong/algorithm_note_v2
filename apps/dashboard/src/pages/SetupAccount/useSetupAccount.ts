import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUser } from '@clerk/clerk-react';
import type { User } from '../../store/useAuthStore';

export function useSetupAccount() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { setUser: setStoreUser, setAuthState } = useAuthStore();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string | undefined;
      console.log('User info:', user);
      console.log('User Role:', user.publicMetadata?.role);

      if (role === 'member') {
        // Store에 사용자 정보 저장
        const storeUser: User = {
          id: user.id,
          emailAddress: user.primaryEmailAddress?.emailAddress || '',
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          imageUrl: user.imageUrl || undefined,
          publicMetadata: {
            role: role,
          },
        };

        setStoreUser(storeUser);
        setAuthState({
          isLoaded: true,
          isSignedIn: true,
        });

        navigate('/dashboard');
        return;
      }
    }

    const reloadInterval = setInterval(() => {
      if (user) {
        console.log('Reloading user info...');
        user.reload();
      }
    }, 1000);

    // role이 member가 아니거나 사용자 정보가 없는 경우 타이머 설정
    const timeoutTimer = setTimeout(() => {
      if (isLoaded && (!user || user.publicMetadata?.role !== 'member')) {
        console.log('Unauthorized access or user info missing, redirecting to /unauthorized');
        navigate('/unauthorized');
      }
    }, 15000);

    return () => {
      clearInterval(reloadInterval);
      clearTimeout(timeoutTimer);
    };
  }, [isLoaded, user, setStoreUser, setAuthState, navigate]);

  return {};
}