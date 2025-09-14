// LoginPage.jsx

import { GoogleLoginButton } from 'ui-components/src/components';
import { EmailLoginButton } from 'ui-components/src/components';
import YourLogo from './path-to-your/logo.svg'; // 로고 SVG 파일을 직접 import

export default function LoginPage() {
  return (
    // 1. 전체 페이지 컨테이너: 다크 모드 배경 및 중앙 정렬
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      
      {/* 2. 콘텐츠 영역: 너비 제한 및 내부 요소 배치 */}
      <div className="w-full max-w-xs flex flex-col items-center">
        
        {/* 로고 */}
        <img src={YourLogo} alt="Company Logo" className="h-10 w-10 mb-8" />
        
        {/* 제목 */}
        <h1 className="text-2xl font-semibold mb-6">Log in to Linear</h1>
        
        {/* 3. 버튼 그룹: 컴포넌트 배치 및 간격 설정 */}
        <div className="w-full flex flex-col space-y-3">
          <GoogleLoginButton />
          <EmailLoginButton />
        </div>
        
        {/* 4. 하단 텍스트 링크 */}
        <p className="mt-8 text-sm text-gray-400">
          Don't have an account?
          <a href="#" className="font-semibold text-white hover:underline ml-1">
            Sign up
          </a> or
          <a href="#" className="font-semibold text-white hover:underline ml-1">
            Learn more
          </a>
        </p>

      </div>
    </main>
  );
}