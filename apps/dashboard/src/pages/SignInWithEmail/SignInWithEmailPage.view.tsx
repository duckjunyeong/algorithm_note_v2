import React from 'react';
import { SignInWithEmailButton } from '../../../../../libs/ui-components/src/components/sign-in-with-email-button';

interface SignInWithEmailPageViewProps {
  email: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onBackToLogin: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onContinueClick: () => void;
}

export function SignInWithEmailPageView({
  email,
  error,
  isLoading,
  onEmailChange,
  onBackToLogin,
  onSubmit,
  onContinueClick
}: SignInWithEmailPageViewProps) {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs flex flex-col items-center">

        <div className="h-10 w-10 mb-8 bg-white rounded-full">
        </div>

        <h1 className="text-xl font-normal mb-6 text-center">
          What's your email address?
        </h1>

        <form onSubmit={onSubmit} className="w-full flex flex-col space-y-4">

          <div className="w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email address..."
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

            {error && (
              <p className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <SignInWithEmailButton
            onClick={onContinueClick}
            disabled={isLoading || !email.trim()}
          />

        </form>

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

      </div>
    </main>
  );
}