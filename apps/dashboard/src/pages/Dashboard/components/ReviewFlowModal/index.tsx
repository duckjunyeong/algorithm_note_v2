import { useReviewFlowModal } from './useReviewFlowModal';
import type { UseReviewFlowModalProps } from './useReviewFlowModal';
import { ReviewFlowModalView } from './ReviewFlowModal.view';

export function ReviewFlowModal(props: UseReviewFlowModalProps) {
  const {
    currentView,
    selectedReviewType,
    reviewCardId,
    reviewCard,
    handleSelectReviewType,
    handleProceedToTest,
    handleBackToSelection,
    handleClose,
    isOpen,
  } = useReviewFlowModal(props);

  return (
    <ReviewFlowModalView
      isOpen={isOpen}
      currentView={currentView}
      selectedReviewType={selectedReviewType}
      reviewCardId={reviewCardId}
      reviewCard={reviewCard}
      onSelectReviewType={handleSelectReviewType}
      onProceedToTest={handleProceedToTest}
      onBackToSelection={handleBackToSelection}
      onClose={handleClose}
    />
  );
}
