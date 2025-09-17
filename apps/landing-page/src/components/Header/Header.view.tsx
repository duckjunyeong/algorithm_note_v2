// components/Header/Header.view.tsx

import { ChevronDown } from 'lucide-react';

// 로고 SVG 컴포넌트 (실제 SVG 코드로 교체하세요)
function MercuryLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0L25.9282 6.52786V19.4721L16 26L6.0718 19.4721V6.52786L16 0Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 32L25.9282 25.4721V12.5279L16 6L6.0718 12.5279V25.4721L16 32Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}


// NavLink 타입 정의
interface NavLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
}

// HeaderView 컴포넌트가 받을 props 타입 정의
interface HeaderViewProps {
  navLinks: NavLink[];
}

export function HeaderView({ navLinks }: HeaderViewProps) {
  return (
    <header className="w-full bg-[#F9F8F6] font-sans">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-3">
          <MercuryLogo />
          <span className="text-xl font-semibold tracking-wider text-gray-800">MERCURY</span>
        </div>

        {/* Center Section: Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center text-gray-700 transition-colors duration-200 hover:text-gray-900"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-6">
          <a href="/login" className="text-gray-700 transition-colors duration-200 hover:text-gray-900">
            Log in
          </a>
          <button
            className="rounded-lg bg-[#6A59FF] px-5 py-2.5 text-sm font-medium text-white shadow-sm
                       transition-all duration-200 hover:bg-[#5848d8] focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Open Account
          </button>
        </div>
      </div>
    </header>
  );
}