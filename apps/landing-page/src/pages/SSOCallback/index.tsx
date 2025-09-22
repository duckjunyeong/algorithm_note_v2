import { useEffect } from 'react'
import { useClerk, useSession } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

interface RedirectResult {
  createdSessionId?: string;
}

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const { session, isLoaded } = useSession(); // isLoaded 추가
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await handleRedirectCallback({
          afterSignInUrl: 'http://localhost:5173',
          afterSignUpUrl: 'http://localhost:5173'
        }) as RedirectResult;
      } catch (error) {
        console.error('SSO callback error:', error);
        navigate('/error');
      }
    })();
  }, []); 

  useEffect(() => {
    if (isLoaded && session) {
      console.log('Session is active, navigating...');
      window.location.href = 'http://localhost:5173';
    }
  }, [isLoaded, session, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">세션 확인 중...</p>
        </div>
      </div>
    );
  }

  // 로딩 UI
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  );
}