// Header/useHeader.ts
import { FiFile } from 'react-icons/fi';
import type { IconType } from 'react-icons';

// 브레드크럼 아이템의 타입 정의
export interface BreadcrumbItem {
  icon: IconType;
  label: string;
}

/**
 * Header 컴포넌트에 필요한 정적 데이터를 제공하는 훅
 */
export const useHeader = () => {
  // 예시를 위한 목업(mockup) 데이터
  const appName = "Vercel AI";
  const userName = "강준영";
  const breadcrumbs: BreadcrumbItem[] = [
    { icon: FiFile, label: "junyeongand's space" },
    { icon: FiFile, label: "프로필과/비밀번호" },
  ];

  return {
    appName,
    userName,
    breadcrumbs,
  };
};