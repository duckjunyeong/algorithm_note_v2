import { useEffect } from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback({
          redirectUrl: window.location.href
        })
        navigate('/dashboard')
      } catch (error) {
        console.error('SSO callback error:', error)
        navigate('/sign-in')
      }
    }

    handleCallback()
  }, [handleRedirectCallback, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  )
}