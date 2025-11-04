import { useState } from 'react';

export interface UseReviewCardProps {
  isActive?: boolean;
  onTestStart?: () => void;
  onResultView?: () => void;
  url?: string;
}

export function useReviewCard({ isActive = true, onTestStart, onResultView, url }: UseReviewCardProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleButtonClick = () => {
    if (isActive && onTestStart) {
      onTestStart();
    } else if (!isActive && onResultView) {
      onResultView();
      console.log('View Results clicked');
    }
  };

  const handleOpenUrl = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return {
    isHovering,
    isActive,
    url,
    handleMouseEnter,
    handleMouseLeave,
    handleButtonClick,
    handleOpenUrl,
  };
}
