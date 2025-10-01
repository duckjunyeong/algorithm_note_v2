import { useReviewCard, type UseReviewCardProps } from './useReviewCard';
import { ReviewCardView, type ReviewCardViewProps } from './ReviewCard.view';

interface Tag {
  label: string;
  value: string | number;
  backgroundColor?: string;
  textColor?: string;
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
  onTestStart,
}: ReviewCardProps) {
  const {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    handleTestButtonClick,
  } = useReviewCard({ onTestStart });

  return (
    <ReviewCardView
      id={id}
      category={category}
      title={title}
      tags={tags}
      isHovering={isHovering}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTestButtonClick={handleTestButtonClick}
    />
  );
}
