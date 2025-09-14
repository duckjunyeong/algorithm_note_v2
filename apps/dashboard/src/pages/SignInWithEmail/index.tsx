import { useSignInWithEmail } from './useSignInWithEmail';
import { SignInWithEmailPageView } from './SignInWithEmailPage.view';

export function SignInWithEmailPage() {
  const {
    email,
    error,
    isLoading,
    handleEmailChange,
    handleBackToLogin,
    handleSubmit,
    handleContinueClick
  } = useSignInWithEmail();

  return (
    <SignInWithEmailPageView
      email={email}
      error={error}
      isLoading={isLoading}
      onEmailChange={handleEmailChange}
      onBackToLogin={handleBackToLogin}
      onSubmit={handleSubmit}
      onContinueClick={handleContinueClick}
    />
  );
}

export default SignInWithEmailPage;