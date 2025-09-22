// SidebarNav/icons.tsx
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * Skyscape Systems의 커스텀 로고 SVG 컴포넌트
 */
export const CompanyLogo: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="url(#paint0_linear_1_2)" />
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8B1FF" />
        <stop offset="1" stopColor="#7B83EB" />
      </linearGradient>
    </defs>
  </svg>
);