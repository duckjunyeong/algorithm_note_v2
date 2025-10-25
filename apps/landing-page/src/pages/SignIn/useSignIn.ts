import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function useSignIn() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuthStore();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = import.meta.env.VITE_DASHBOARD_URL;
    }
  }, [isSignedIn]);

  const handleEmailSignInClick = () => {
    navigate('/sign-in/email');
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
  };

  return {
    handleEmailSignInClick,
    handleSignUpClick
  };
}
