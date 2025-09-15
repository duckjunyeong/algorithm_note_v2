import { useEffect } from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
        navigate('/dashboard')
      } catch (error) {
        console.error('SSO callback error:', error)
        navigate('/sign-in')
      }
    }

    handleCallback()
  }, [handleRedirectCallback, navigate])

  return (
    import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const navigate = useNavigate()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback()
        navigate('/dashboard')
      } catch (err) {
        console.error('SSO callback error:', err)
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error('An unknown error occurred.'))
        }
      }
    }

    handleCallback()
  }, [handleRedirectCallback, navigate])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">인증 실패</h1>
          <p className="text-gray-700 mb-6">
            SSO 인증 과정에서 오류가 발생했습니다.
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
            {error.message}
          </p>
          <button
            onClick={() => navigate('/sign-in')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  )
}
  )
}