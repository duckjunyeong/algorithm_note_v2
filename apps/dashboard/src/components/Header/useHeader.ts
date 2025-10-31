// Header/useHeader.ts
import { useMemo, useState, useRef, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 사용자 이메일
  const userEmail = useMemo(() => {
    return user?.emailAddress || '';
  }, [user]);

  // 동적 breadcrumbs 생성
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { icon: FiFile, label: `${userName}'s space` },
    { icon: FiFile, label: "프로필과/비밀번호" },
  ], [userName]);

  const appName = "Synapse AI";

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 드롭다운 닫기
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Escape 키 감지
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen]);

  return {
    appName,
    userName,
    userEmail,
    breadcrumbs,
    isDropdownOpen,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
};