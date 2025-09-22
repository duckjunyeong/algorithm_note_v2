// Header/Header.view.tsx
import React from 'react';
import type { IconType } from 'react-icons';
import type { BreadcrumbItem } from './useHeader';
import { FiMenu, FiGlobe, FiChevronDown } from 'react-icons/fi';

interface HeaderViewProps {
  appName: string;
  userName: string;
  breadcrumbs: BreadcrumbItem[];
  onToggleSidebar: () => void; // 사이드바 토글 함수
}

export const HeaderView: React.FC<HeaderViewProps> = ({
  appName,
  userName,
  breadcrumbs,
  onToggleSidebar,
}) => {
  // 사용자 이름의 첫 글자를 따서 아바타 이니셜로 사용
  const userInitial = userName.charAt(0) || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background-secondary border-b border-neutral-100 font-sans">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 왼쪽 섹션 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Toggle Sidebar"
          >
            <FiMenu size={22} />
          </button>
          <div className="h-6 w-px bg-neutral-100"></div>
          <span className="font-bold text-text-primary">{appName}</span>
          <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-text-secondary hover:bg-neutral-50">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {index < breadcrumbs.length - 1 && <FiChevronDown className="h-4 w-4 text-neutral-300" />}
            </React.Fragment>
          ))}
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="flex items-center gap-4">
          <button className="text-text-secondary hover:text-text-primary">
            <FiGlobe size={20} />
          </button>
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
};