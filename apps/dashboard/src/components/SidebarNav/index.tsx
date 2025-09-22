// SidebarNav/index.tsx
import React, { useState } from 'react';
import { useSidebarNavData } from './useSidebarNavData';
import { SidebarNavView } from './SidebarNav.view';

interface SidebarNavProps {
  isOpen: boolean; // 부모로부터 isOpen 상태를 받습니다.
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen }) => {
  const { mainNavItems, workflowItems, companyName } = useSidebarNavData();
  const [activeItemId, setActiveItemId] = useState('home');

  const handleItemClick = (id: string) => {
    setActiveItemId(id);
  };

  return (
    <SidebarNavView
      isOpen={isOpen}
      activeItemId={activeItemId}
      onItemClick={handleItemClick}
      mainNavItems={mainNavItems}
      workflowItems={workflowItems}
      companyName={companyName}
    />
  );
};