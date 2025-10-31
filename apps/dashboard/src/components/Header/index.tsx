// Header/index.tsx
import React from 'react';
import { useHeader } from './useHeader';
import { HeaderView } from './Header.view';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    appName,
    userName,
    userEmail,
    breadcrumbs,
    isDropdownOpen,
    dropdownRef,
    toggleDropdown
  } = useHeader();

  return (
    <HeaderView
      appName={appName}
      userName={userName}
      userEmail={userEmail}
      breadcrumbs={breadcrumbs}
      isDropdownOpen={isDropdownOpen}
      dropdownRef={dropdownRef}
      toggleDropdown={toggleDropdown}
      onToggleSidebar={onToggleSidebar}
    />
  );
};