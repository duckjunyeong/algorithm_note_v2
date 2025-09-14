import SignInPageView from "./SignInPage.view";
import { useSignIn } from "./useSignIn";

const SignInPage = () => {
  const { handleEmailSignInClick } = useSignIn();

  return (
    <SignInPageView onEmailSignInClick={handleEmailSignInClick} />
  )
}

export default SignInPage;