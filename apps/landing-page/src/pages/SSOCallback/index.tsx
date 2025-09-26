import { useEffect } from 'react'
import { useClerk, useSession } from '@clerk/clerk-react'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        await handleRedirectCallback({
          signInForceRedirectUrl: '/redirect-helper',
          signUpForceRedirectUrl: '/redirect-helper',
        });
      } catch (error) {
        console.error('SSO Callback Error:', error);
        window.location.href = 'http://localhost:5173/sign-in';
      }
    };

    processRedirect();
  }, [handleRedirectCallback]);

  return (
    <></>
  );
}