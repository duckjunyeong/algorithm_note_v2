import { useSignUpWithEmail } from './useSignUpWithEmail';
import { SignUpWithEmailPageView } from './SignUpWithEmailPage.view';

export function SignUpWithEmailPage() {
  const {
    step,
    email,
    password,
    verificationCode,
    error,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleVerificationCodeChange,
    handleBackToLogin,
    handleBackToEmail,
    handleBackToPassword,
    handleSubmit,
    handleContinueClick
  } = useSignUpWithEmail();

  return (
    <SignUpWithEmailPageView
      step={step}
      email={email}
      password={password}
      verificationCode={verificationCode}
      error={error}
      isLoading={isLoading}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onVerificationCodeChange={handleVerificationCodeChange}
      onBackToLogin={handleBackToLogin}
      onBackToEmail={handleBackToEmail}
      onBackToPassword={handleBackToPassword}
      onSubmit={handleSubmit}
      onContinueClick={handleContinueClick}
    />
  );
}

export default SignUpWithEmailPage;