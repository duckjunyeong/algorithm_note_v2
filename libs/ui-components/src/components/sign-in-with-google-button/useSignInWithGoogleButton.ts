import { useSignIn } from '@clerk/clerk-react'

export const useSignInWithGoogleButton = () => {
  const { signIn, isLoaded } = useSignIn()

  const signInWithGoogle = async () => {
    if (!isLoaded || !signIn) {
      console.error('Clerk is not loaded yet')
      return
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/setup-account',
      })
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  return {
    isLoaded,
    signInWithGoogle,
  }
}