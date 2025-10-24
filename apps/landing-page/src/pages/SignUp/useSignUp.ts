import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp as useClerkSignUp } from '@clerk/clerk-react';
import { useAuthStore } from '../../store/useAuthStore';

export function useSignUp() {
  const [hasGoogleHistory, setHasGoogleHistory] = useState(false);
  const navigate = useNavigate();
  const { signUp, isLoaded } = useClerkSignUp();
  const { isSignedIn } = useAuthStore();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = import.meta.env.VITE_DASHBOARD_URL;
    }
  }, [isSignedIn]);

  useEffect(() => {
    const googleHistory = localStorage.getItem('previous-google-login');
    setHasGoogleHistory(!!googleHistory);
  }, []);

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) {
      console.error('Clerk is not loaded yet');
      return;
    }

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: import.meta.env.VITE_DASHBOARD_URL,
      });

      // Store Google login preference
      localStorage.setItem('previous-google-login', 'true');
    } catch (error) {
      console.error('Error signing up with Google:', error);
    }
  };

  const handleEmailSignUp = () => {
    navigate('/sign-up/email');
  };

  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  return {
    hasGoogleHistory,
    isLoaded,
    handleGoogleSignUp,
    handleEmailSignUp,
    handleSignInClick
  };
}