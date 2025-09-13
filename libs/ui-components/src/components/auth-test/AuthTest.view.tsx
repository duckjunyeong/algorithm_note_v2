import { AuthTestData } from './useAuthTest'

interface AuthTestViewProps extends AuthTestData {}

export function AuthTestView({
  isSignedIn,
  isLoaded,
  userId,
  userEmail,
  userName,
  signOut,
}: AuthTestViewProps) {
  if (!isLoaded) {
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Clerk Auth Test</h3>
        <p className="text-gray-600">Loading authentication state...</p>
      </div>
    )
  }

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <h3 className="text-lg font-semibold mb-4">Clerk Auth Test</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">Authentication Status:</span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              isSignedIn
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isSignedIn ? 'Signed In' : 'Not Signed In'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Auth Loaded:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isLoaded ? 'Yes' : 'No'}
          </span>
        </div>

        {isSignedIn && (
          <>
            <div className="flex items-center gap-2">
              <span className="font-medium">User ID:</span>
              <span className="text-gray-700 text-sm font-mono">{userId}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Email:</span>
              <span className="text-gray-700">{userEmail || 'Not available'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Name:</span>
              <span className="text-gray-700">{userName || 'Not available'}</span>
            </div>

            <button
              onClick={signOut}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        )}

        {!isSignedIn && (
          <div className="mt-3 text-gray-600">
            <p>Please sign in to test user information display....</p>
          </div>
        )}
      </div>
    </div>
  )
}