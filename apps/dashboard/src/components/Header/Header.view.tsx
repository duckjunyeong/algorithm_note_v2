// Header/Header.view.tsx
import React from 'react';
import type { BreadcrumbItem } from './useHeader';
import { FiMenu, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useClerk } from "@clerk/clerk-react";

interface HeaderViewProps {
  appName: string;
  userName: string;
  userEmail: string;
  breadcrumbs: BreadcrumbItem[];
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleDropdown: () => void;
  onToggleSidebar: () => void;
}

export const HeaderView = ({
  appName,
  userName,
  userEmail,
  breadcrumbs,
  isDropdownOpen,
  dropdownRef,
  toggleDropdown,
  onToggleSidebar,
}: HeaderViewProps) => {
  const userInitial = userName.charAt(0) || 'U';
  const { signOut } = useClerk();

  function handleSignOut() {
    signOut({ redirectUrl: import.meta.env.VITE_LANDING_URL });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background-secondary border-b border-neutral-100 font-sans">
      <div className="flex h-16 items-center justify-between px-6">
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
     
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              {userInitial}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-100 z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-medium text-text-primary">{userName}</p>
                  <p className="text-xs text-text-secondary mt-1">{userEmail}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-secondary hover:bg-neutral-50 hover:text-text-primary transition-colors duration-200"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};