import type { NavLink } from './useHeader';

interface HeaderViewProps {
  /** 네비게이션에 표시될 링크 객체의 배열입니다. */
  navLinks: NavLink[];
  /** 인증 버튼에 표시될 텍스트입니다. */
  authButtonText: string;
  /** 인증 버튼(Sign in/Logout) 클릭 시 호출될 함수입니다. */
  onAuthClick: () => void;
}

export const HeaderView = ({
  navLinks,
  authButtonText,
  onAuthClick,
}: HeaderViewProps) => {
  return (
     <header
      className="sticky top-0 z-50 w-full bg-background-primary font-sans text-text-primary transition-all duration-300"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 text-xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 3v18" />
              <path d="M12 3v18" />
              <path d="M17 3v18" />
            </svg>
            <span>Synapse</span>
          </div>
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onAuthClick}
            className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
          >
            {authButtonText}
          </button>
        </div>
      </nav>
    </header>
  );
};