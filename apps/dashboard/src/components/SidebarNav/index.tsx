// SidebarNav/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarNavData } from './useSidebarNavData';
import { SidebarNavView } from './SidebarNav.view';

interface SidebarNavProps {
  isOpen: boolean; // 부모로부터 isOpen 상태를 받습니다.
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const { mainNavItems, workflowItems } = useSidebarNavData();
  const [activeItemId, setActiveItemId] = useState('card-task');

  const handleItemClick = (id: string) => {
    setActiveItemId(id);

    // 네비게이션 처리
    if (id === 'card-task') {
      navigate('/dashboard');
    } else if (id === 'logic-task') {
      navigate('/logic-task');
    }
  };

  return (
    <SidebarNavView
      isOpen={isOpen}
      activeItemId={activeItemId}
      onItemClick={handleItemClick}
      mainNavItems={mainNavItems}
      workflowItems={workflowItems}
    />
  );
};