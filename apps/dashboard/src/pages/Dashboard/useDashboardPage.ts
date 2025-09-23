// DashboardPage/useDashboardPage.ts
import { useState } from 'react';

// TaskCard에 전달될 데이터 타입을 정의합니다.
export interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
}

/**
 * DashboardPage의 비즈니스 로직 및 상태 관리를 위한 커스텀 훅
 */
export const useDashboardPage = () => {
  // 사이드바 표시 여부 상태
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // 사이드바 상태를 토글하는 함수
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // 실제 앱에서는 API 호출을 통해 이 데이터를 가져옵니다.
  // 현재는 샘플 데이터를 사용합니다.
  const tasks: Task[] = [
    {
      id: 'T-002',
      type: '서브태스크',
      title: '[backend] 문제 등록 및 AI 분석 파이프라인 구축',
      description: '프론트엔드에서 코드 파일 및 문제 링크 업로드 UI 제공 업로드 된 파일을 Firebase Storage에 안전하게 저장하는 API 개발...',
    },
    {
      id: 'T-001',
      type: '서브태스크',
      title: '[frontend] Clerk 기반 소셜 로그인/회원가입 기능 구현',
      description: 'Clerk 라이브러리 초기 통합 및 환경 설정 프론트엔드 로그인/회원가입 UI 개발 및 인증 플로우 구현 백엔드 인증 토큰 검증...',
    },
  ];

  // 뷰 컴포넌트에서 사용할 상태와 함수들을 반환합니다.
  return {
    isSidebarOpen,
    tasks,
    toggleSidebar,
  };
};