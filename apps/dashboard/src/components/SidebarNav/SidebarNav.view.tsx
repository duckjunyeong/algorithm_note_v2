// SidebarNav/SidebarNav.view.tsx
import React from 'react';
import type { NavItem } from './useSidebarNavData';
import { FiChevronDown } from 'react-icons/fi';

interface SidebarNavViewProps {
  isOpen: boolean;
  activeItemId: string;
  onItemClick: (id: string) => void;
  mainNavItems: NavItem[];
  workflowItems: NavItem[];
}

export const SidebarNavView: React.FC<SidebarNavViewProps> = ({
  isOpen,
  activeItemId,
  onItemClick,
  mainNavItems,
  workflowItems,
}) => {
  const renderNavItem = (item: NavItem) => {
    const isActive = activeItemId === item.id;
    return (
      <li key={item.id}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onItemClick(item.id);
          }}
          className={`
            flex items-center p-2 rounded-md transition-colors duration-200
            ${
              isActive
                ? 'bg-neutral-50 text-text-primary font-semibold'
                : 'text-text-secondary hover:bg-neutral-50 hover:text-text-primary'
            }
          `}
        >
          <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-brand-DEFAULT' : 'text-neutral-400'}`} />
          <span className="ml-3 flex-1 whitespace-nowrap text-xs">{item.label}</span>
          {item.badge && (
            <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-text-secondary">
              {item.badge}
            </span>
          )}
          {item.isDropdown && <FiChevronDown className="ml-auto h-2 w-2 text-neutral-400" />}
        </a>
      </li>
    );
  };

  return (
    <nav
      className={`
        fixed left-0 z-40 flex-col bg-background-primary p-4 font-sans
        transform transition-transform duration-300 ease-in-out
        w-[175px]
        top-[65px] h-screen 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >

      {/* 메인 네비게이션 */}
      <div className="flex-grow">
        <ul className="space-y-1">
          {mainNavItems.map(renderNavItem)}
        </ul>
      </div>

      {/* 워크플로우 섹션 */}
      <div>
        <h3 className="px-2 pt-4 pb-2 text-xs font-semibold uppercase text-text-tertiary">
          Workflows
        </h3>
        <ul className="space-y-1">
          {workflowItems.map(renderNavItem)}
        </ul>
      </div>
    </nav>
  );
};