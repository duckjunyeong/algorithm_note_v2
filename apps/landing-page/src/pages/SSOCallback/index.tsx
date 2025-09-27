import { useEffect } from 'react'
import { PATHS } from '../../constants/Paths';
import { ERROR_MESSAGES } from '../../constants/messages';
import { useClerk, useSession } from '@clerk/clerk-react'

const CLERK_SIGN_IN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL;

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        await handleRedirectCallback({
          signInForceRedirectUrl: PATHS.REDIRECT_HELPER,
          signUpForceRedirectUrl: PATHS.REDIRECT_HELPER,
        });
      } catch (error) {
        console.error(ERROR_MESSAGES.SSO_CALLBACK_ERROR, error);
        window.location.href = CLERK_SIGN_IN_URL;
      }
    };

    processRedirect();
  }, [handleRedirectCallback]);

  return (
    <></>
  );
}