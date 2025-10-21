import { useReviewCard, type UseReviewCardProps } from './useReviewCard';
import { ReviewCardView } from './ReviewCard.view';

interface Tag {
  label: string;
  value: string | number;
}



export interface ReviewCardProps extends UseReviewCardProps {
  id: string;
  category: string;
  title: string;
  tags?: Tag[];
}

export function ReviewCard({
  id,
  category,
  title,
  tags,
  isActive,
  onTestStart,
  onResultView,
}: ReviewCardProps) {
  const {
    isHovering,
    isActive: activeStatus,
    handleMouseEnter,
    handleMouseLeave,
    handleButtonClick,
  } = useReviewCard({ isActive, onTestStart, onResultView });

  return (
    <ReviewCardView
      id={id}
      category={category}
      title={title}
      tags={tags}
      isHovering={isHovering}
      isActive={activeStatus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onButtonClick={handleButtonClick}
    />
  );
}
