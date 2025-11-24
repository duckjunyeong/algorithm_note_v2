import { useReviewFlowModal } from './useReviewFlowModal';
import type { UseReviewFlowModalProps } from './useReviewFlowModal';
import { ReviewFlowModalView } from './ReviewFlowModal.view';

export function ReviewFlowModal(props: UseReviewFlowModalProps) {
  const {
    currentView,
    selectedAiMode,
    selectedTutorLevel,
    reviewCardId,
    reviewCard,
    handleBackToAiSelection,
    handleClose,
    isOpen,
  } = useReviewFlowModal(props);

  return (
    <ReviewFlowModalView
      isOpen={isOpen}
      currentView={currentView}
      selectedAiMode={selectedAiMode}
      selectedTutorLevel={selectedTutorLevel}
      reviewCardId={reviewCardId}
      reviewCard={reviewCard}
      onBackToAiSelection={handleBackToAiSelection}
      onClose={handleClose}
    />
  );
}
