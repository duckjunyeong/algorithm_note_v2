import { useClerk } from '@clerk/clerk-react';
import { useAuthStore } from '../../store/useAuthStore';

/** 네비게이션 링크의 구조를 정의하는 타입입니다. */
export type NavLink = {
  label: string;
  href: string;
};

export const useHeader = () => {
  const { signOut } = useClerk();
  const { isSignedIn } = useAuthStore();

  const navLinks: NavLink[] = [
    { label: 'dashboard', href: import.meta.env.VITE_DASHBOARD_URL },
  ];

  const handleAuthClick = async () => {
    if (isSignedIn) {
      await signOut();
    } else {
      window.location.href = '/sign-in';
    }
  };

  const handleRequestDemo = () => {
    // TODO: 실제 데모 요청 로직 구현
    console.log('Request a Demo clicked');
    alert('Request a Demo clicked!');
  };

  const handleTryForFree = () => {
    // TODO: 실제 무료 체험 로직 구현
    console.log('Try for Free clicked');
    alert('Try for Free clicked!');
  };

  return {
    navLinks,
    authButtonText: isSignedIn ? 'Logout' : 'Sign in',
    handleAuthClick,
    handleRequestDemo,
    handleTryForFree,
  };
};