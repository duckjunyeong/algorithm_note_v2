// Header/useHeader.ts
import { useMemo } from 'react';
import { FiFile } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useAuthStore } from '../../store/useAuthStore';

// 브레드크럼 아이템의 타입 정의
export interface BreadcrumbItem {
  icon: IconType;
  label: string;
}

/**
 * Header 컴포넌트에 필요한 동적 데이터를 제공하는 훅
 * useAuthStore에서 사용자 정보를 가져와 동적으로 userName과 breadcrumbs를 생성합니다.
 */
export const useHeader = () => {
  const user = useAuthStore((state) => state.user);

  // 사용자 이름 동적 생성
  const userName = useMemo(() => {
    if (!user) return 'User';

    const { firstName, lastName } = user;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;

    return 'User';
  }, [user]);

  // 동적 breadcrumbs 생성
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { icon: FiFile, label: `${userName}'s space` },
    { icon: FiFile, label: "프로필과/비밀번호" },
  ], [userName]);

  const appName = "Synapse AI";

  return {
    appName,
    userName,
    breadcrumbs,
  };
};