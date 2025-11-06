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
  url,
}: ReviewCardProps) {
  const {
    isHovering,
    isActive: activeStatus,
    url: cardUrl,
    handleMouseEnter,
    handleMouseLeave,
    handleButtonClick,
    handleOpenUrl,
  } = useReviewCard({ isActive, onTestStart, onResultView, url });

  return (
    <ReviewCardView
      id={id}
      category={category}
      title={title}
      tags={tags}
      isHovering={isHovering}
      isActive={activeStatus}
      url={cardUrl}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onButtonClick={handleButtonClick}
      onOpenUrl={handleOpenUrl}
    />
  );
}
