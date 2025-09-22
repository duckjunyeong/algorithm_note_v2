// Header/index.tsx
import React from 'react';
import { useHeader } from './useHeader';
import { HeaderView } from './Header.view';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { appName, userName, breadcrumbs } = useHeader();

  return (
    <HeaderView
      appName={appName}
      userName={userName}
      breadcrumbs={breadcrumbs}
      onToggleSidebar={onToggleSidebar}
    />
  );
};