import { useSignUp } from './useSignUp';
import { SignUpPageView } from './SignUpPage.view';

export function SignUpPage() {
  const {
    hasGoogleHistory,
    isLoaded,
    handleGoogleSignUp,
    handleEmailSignUp,
    handleSignInClick
  } = useSignUp();

  return (
    <SignUpPageView
      hasGoogleHistory={hasGoogleHistory}
      isLoaded={isLoaded}
      onGoogleSignUp={handleGoogleSignUp}
      onEmailSignUp={handleEmailSignUp}
      onSignInClick={handleSignInClick}
    />
  );
}

export default SignUpPage;