import React from 'react';
import { SignInWithEmailButton } from '../../../../../libs/ui-components/src/components/sign-in-with-email-button';

type SignUpStep = 'email' | 'password' | 'verification';

interface SignUpWithEmailPageViewProps {
  step: SignUpStep;
  email: string;
  password: string;
  verificationCode: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onVerificationCodeChange: (value: string) => void;
  onBackToLogin: () => void;
  onBackToEmail: () => void;
  onBackToPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onContinueClick: () => void;
}

export function SignUpWithEmailPageView({
  step,
  email,
  password,
  verificationCode,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onVerificationCodeChange,
  onBackToLogin,
  onBackToEmail,
  onBackToPassword,
  onSubmit,
  onContinueClick
}: SignUpWithEmailPageViewProps) {
  const getTitle = () => {
    switch (step) {
      case 'email':
        return "What's your email address?";
      case 'password':
        return 'Create your password';
      case 'verification':
        return 'Check your email';
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 'email':
        return 'Continue with Email';
      case 'password':
        return 'Create Account';
      case 'verification':
        return 'Verify & Complete';
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'email':
        return 'Enter your email address...';
      case 'password':
        return 'Create a strong password...';
      case 'verification':
        return 'Enter 6-digit code...';
    }
  };

  const getCurrentValue = () => {
    switch (step) {
      case 'email':
        return email;
      case 'password':
        return password;
      case 'verification':
        return verificationCode;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (step) {
      case 'email':
        onEmailChange(value);
        break;
      case 'password':
        onPasswordChange(value);
        break;
      case 'verification':
        onVerificationCodeChange(value);
        break;
    }
  };

  const getInputType = () => {
    switch (step) {
      case 'email':
        return 'email';
      case 'password':
        return 'password';
      case 'verification':
        return 'text';
    }
  };

  const isButtonDisabled = () => {
    const currentValue = getCurrentValue();
    return isLoading || !currentValue.trim();
  };

  const getBackButton = () => {
    switch (step) {
      case 'email':
        return (
          <button
            type="button"
            onClick={onBackToLogin}
            disabled={isLoading}
            className={`
              mt-6 text-sm text-gray-400
              hover:text-white hover:underline
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            Back to login
          </button>
        );
      case 'password':
        return (
          <button
            type="button"
            onClick={onBackToEmail}
            disabled={isLoading}
            className={`
              mt-6 text-sm text-gray-400
              hover:text-white hover:underline
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            Back to email
          </button>
        );
      case 'verification':
        return (
          <button
            type="button"
            onClick={onBackToPassword}
            disabled={isLoading}
            className={`
              mt-6 text-sm text-gray-400
              hover:text-white hover:underline
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            Back to password
          </button>
        );
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs flex flex-col items-center">

        <div className="h-10 w-10 mb-8 bg-white rounded-full">
        </div>

        <h1 className="text-xl font-normal mb-6 text-center">
          {getTitle()}
        </h1>

        {step === 'verification' && (
          <p className="text-sm text-gray-400 mb-4 text-center">
            We sent a verification code to {email}
          </p>
        )}

        <form onSubmit={onSubmit} className="w-full flex flex-col space-y-4">

          <div className="w-full">
            <input
              type={getInputType()}
              value={getCurrentValue()}
              onChange={handleInputChange}
              placeholder={getPlaceholder()}
              disabled={isLoading}
              className={`
                w-full px-4 py-3 rounded-lg text-sm
                bg-gray-800 border border-gray-600 text-white
                placeholder-gray-400
                focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
            />

            {step === 'password' && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            )}

            {error && (
              <p className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <SignInWithEmailButton
            onClick={onContinueClick}
            disabled={isButtonDisabled()}
          >
            {getButtonText()}
          </SignInWithEmailButton>

        </form>

        {getBackButton()}

      </div>
    </main>
  );
}