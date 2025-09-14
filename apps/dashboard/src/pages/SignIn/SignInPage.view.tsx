import React from 'react';
import { SignInWithGoogleButton } from '../../../../../libs/ui-components/src/components/sign-in-with-google-button'
import { SignInWithEmailButton } from '../../../../../libs/ui-components/src/components/sign-in-with-email-button';

const LoginPageView: React.FC = () => {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      
      <div className="w-full max-w-xs flex flex-col items-center">
        
        <div className="h-10 w-10 mb-8 bg-white rounded-full">
            {/* <YourLogo className="h-10 w-10" /> */}
        </div>
        
        <h1 className="text-2xl font-semibold mb-6">Log in to AlgorNote</h1>
        
        <div className="w-full flex flex-col space-y-3">
          <SignInWithGoogleButton />
          <SignInWithEmailButton/>
        </div>
        
        <p className="mt-8 text-sm text-gray-400">
          Don't have an account?
          <a href="#" className="font-semibold text-white hover:underline ml-1">
            Sign up
          </a> or
          <a href="#" className="font-semibold text-white hover:underline ml-1">
            Learn more
          </a>
        </p>

      </div>
    </main>
  );
};

export default LoginPageView;