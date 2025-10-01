import { useState } from 'react';

export interface UseReviewCardProps {
  onTestStart?: () => void;
}

export function useReviewCard({ onTestStart }: UseReviewCardProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleTestButtonClick = () => {
    if (onTestStart) {
      onTestStart();
    }
  };

  return {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    handleTestButtonClick,
  };
}
