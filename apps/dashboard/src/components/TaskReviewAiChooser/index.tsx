import { useTaskReviewAiChooserModal } from './useTaskReviewAiChooserModal';
import type { UseTaskReviewAiChooserModalProps } from './useTaskReviewAiChooserModal';
import { TaskReviewAiChooserView } from './TaskReviewAiChooserModal.view';

export function TaskReviewAiChooserModal(props: UseTaskReviewAiChooserModalProps) {
  const {
    isOpen,
    selectedAiMode,
    selectedTutorLevel,
    reviewCardId,
    reviewCard,
    showChatModal,
    showResultModal,
    handleSelectAiMode,
    handleCancel,
    handleNext,
    handleChatModalClose,
    handleReviewTestNext,
    handleTaskResultClose,
  } = useTaskReviewAiChooserModal(props);

  return (
    <TaskReviewAiChooserView
      isOpen={isOpen}
      selectedAiMode={selectedAiMode}
      selectedTutorLevel={selectedTutorLevel}
      reviewCardId={reviewCardId}
      reviewCard={reviewCard}
      showChatModal={showChatModal}
      showResultModal={showResultModal}
      onAiModeSelect={handleSelectAiMode}
      onCancel={handleCancel}
      onNext={handleNext}
      onChatModalClose={handleChatModalClose}
      onReviewTestNext={handleReviewTestNext}
      onTaskResultClose={handleTaskResultClose}
    />
  );
}
