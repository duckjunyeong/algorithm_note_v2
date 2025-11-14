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
    handleSelectAiMode,
    handleProceedToTest,
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
      onSelectAiMode={handleSelectAiMode}
      onProceedToTest={handleProceedToTest}
      onBackToAiSelection={handleBackToAiSelection}
      onClose={handleClose}
    />
  );
}
