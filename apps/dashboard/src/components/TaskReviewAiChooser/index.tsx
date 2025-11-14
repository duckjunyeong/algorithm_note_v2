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
    handleSelectAiMode,
    handleCancel,
    handleNext,
    handleChatModalClose,
  } = useTaskReviewAiChooserModal(props);

  return (
    <TaskReviewAiChooserView
      isOpen={isOpen}
      selectedAiMode={selectedAiMode}
      selectedTutorLevel={selectedTutorLevel}
      reviewCardId={reviewCardId}
      reviewCard={reviewCard}
      showChatModal={showChatModal}
      onAiModeSelect={handleSelectAiMode}
      onCancel={handleCancel}
      onNext={handleNext}
      onChatModalClose={handleChatModalClose}
    />
  );
}
