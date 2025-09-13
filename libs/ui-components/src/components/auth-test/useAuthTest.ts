import { useAuth, useUser } from '@clerk/clerk-react'

export interface AuthTestData {
  isSignedIn: boolean
  isLoaded: boolean
  userId: string | null
  userEmail: string | null
  userName: string | null
  signOut: () => void
}

export function useAuthTest(): AuthTestData {
  const { isSignedIn, isLoaded, signOut, userId } = useAuth()
  const { user } = useUser()

  return {
    isSignedIn: isSignedIn ?? false,
    isLoaded,
    userId: userId ?? null,
    userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
    userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
    signOut,
  }
}