import { useEffect } from 'react'
import { useClerk, useSession } from '@clerk/clerk-react'

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const { session, isLoaded } = useSession(); // isLoaded 추가

  useEffect(() => {
    // 이 함수에 의해서 reidrect되는 것을 기대
    handleRedirectCallback({
       signInForceRedirectUrl: 'http://localhost:5173',
       signUpForceRedirectUrl: 'http://localhost:5173',
    });
  }, []); 

//  useEffect(() => {
//   if (isLoaded && session) {
//     console.log('Session is active, navigating...');
//      window.location.href = 'http://localhost:5173';
//    }
//  }, [isLoaded, session, navigate]);

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