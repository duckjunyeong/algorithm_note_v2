// TaskCard/useTaskCard.ts
import { useState } from 'react';

export const useTaskCard = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);


  return {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
  };
};