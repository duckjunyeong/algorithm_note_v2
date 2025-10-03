import { useState } from 'react';

export interface UseReviewCardProps {
  isActive?: boolean;
  onTestStart?: () => void;
  onResultView?: () => void;
}

export function useReviewCard({ isActive = true, onTestStart, onResultView }: UseReviewCardProps) {
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

  return {
    isHovering,
    isActive,
    handleMouseEnter,
    handleMouseLeave,
    handleButtonClick,
  };
}
