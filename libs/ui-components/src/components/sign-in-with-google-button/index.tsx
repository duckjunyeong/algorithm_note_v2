// libs/ui-components/src/components/sign-in-with-google-button/index.tsx

import { useSignInWithGoogleButton } from './useSignInWithGoogleButton'
import { SignInWithGoogleButtonView } from './SignInWithGoogleButton.view'

export const SignInWithGoogleButton = () => {
  const { isLoaded, signInWithGoogle } = useSignInWithGoogleButton()

  return (
    <SignInWithGoogleButtonView
      isLoading={!isLoaded}
      onClick={signInWithGoogle}
    />
  )
}