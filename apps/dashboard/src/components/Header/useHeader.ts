import { useMemo, useState, useRef, useEffect } from 'react';
import { FiFile } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useAuthStore } from '../../store/useAuthStore';

export interface BreadcrumbItem {
  icon: IconType;
  label: string;
}


export const useHeader = () => {
  const user = useAuthStore((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const userEmail = useMemo(() => {
    return user?.emailAddress || '';
  }, [user]);

  const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
    { icon: FiFile, label: `${userName}'s space` },
    { icon: FiFile, label: "프로필과/비밀번호" },
  ], [userName]);

  const appName = "Synapse AI";

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

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