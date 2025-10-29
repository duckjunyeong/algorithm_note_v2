
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Spinner } from '../../../../../libs/ui-components/src/components/Spinner';


export default function SSOCallbackPage() {
  return (
    <>
    <Spinner />
    <AuthenticateWithRedirectCallback />
    
    </>
  );
}