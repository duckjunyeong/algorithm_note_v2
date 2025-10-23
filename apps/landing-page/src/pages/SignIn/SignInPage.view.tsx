import {  SignInWithGoogleButton, SignInWithEmailButton } from '../../../../../libs/ui-components/src/index.ts';
import { UI_TEXT } from '../../constants/messages';

interface SignInPageViewProps {
  onEmailSignInClick: () => void;
  onSignUpClick: () => void;
}

const SignInPageView = ({ onEmailSignInClick, onSignUpClick } : SignInPageViewProps) => {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      
      <div className="w-full max-w-xs flex flex-col items-center">
        
        <div className="h-10 w-10 mb-8 bg-white rounded-full">
            {/* <YourLogo className="h-10 w-10" /> */}
        </div>
        
        <h1 className="text-xl font-normal mb-6">{UI_TEXT.SIGN_IN.TITLE}</h1>
        <div className="w-full flex flex-col space-y-3">
          <SignInWithGoogleButton />
          <SignInWithEmailButton onClick={onEmailSignInClick} />
        </div>
        
        <p className="mt-8 text-sm text-gray-400 text-xs">
          {UI_TEXT.SIGN_IN.NO_ACCOUNT}
          <button onClick={onSignUpClick} className="font-semibold text-white hover:underline ml-1 text-xs">
            {UI_TEXT.SIGN_IN.SIGN_UP_LINK}
          </button> or
          <a href="#" className="font-semibold text-white hover:underline ml-1 text-xs">
            {UI_TEXT.SIGN_IN.LEARN_MORE}
          </a>
        </p>

      </div>
    </main>
  );
};

export default SignInPageView;