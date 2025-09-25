import { SignInWithEmailButton } from '../../../../../libs/ui-components/src/components/sign-in-with-email-button';

interface SignUpPageViewProps {
  hasGoogleHistory: boolean;
  isLoaded: boolean;
  onGoogleSignUp: () => void;
  onEmailSignUp: () => void;
  onSignInClick: () => void;
}

export function SignUpPageView({
  onEmailSignUp,
  onSignInClick
}: SignUpPageViewProps) {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs flex flex-col items-center">

        <div className="h-10 w-10 mb-8 bg-white rounded-full">
          {/* Logo would go here */}
        </div>

        {/* Title */}
        <h1 className="text-xl font-normal mb-2 text-center">
          Create your workspace
        </h1>

        <div className="w-full flex flex-col space-y-3 mb-6">
          <SignInWithEmailButton onClick={onEmailSignUp} />
        </div>

        <p className="text-xs text-gray-400 text-center mb-8 leading-relaxed">
          By signing up, you agree to our{' '}
          <a
            href="#"
            className="text-white hover:underline font-medium"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="text-white hover:underline font-medium"
          >
            Data Processing Agreement
          </a>
        </p>

        <p className="text-xs text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSignInClick}
            className="text-white hover:underline font-medium"
          >
            Log in
          </button>
        </p>

      </div>
    </main>
  );
}