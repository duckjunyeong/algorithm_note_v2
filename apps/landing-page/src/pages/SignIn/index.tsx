import SignInPageView from "./SignInPage.view";
import { useSignIn } from "./useSignIn";

const SignInPage = () => {
  const { handleEmailSignInClick, handleSignUpClick } = useSignIn();

  return (
    <SignInPageView
      onEmailSignInClick={handleEmailSignInClick}
      onSignUpClick={handleSignUpClick}
    />
  )
}

export default SignInPage;