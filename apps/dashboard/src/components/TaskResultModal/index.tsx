import { useTaskResultModal } from './useTaskResultModal';
import { TaskResultModalView } from './TaskResultModal.view';

interface TaskResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewCardId: number;
  onCompletionSuccess?: () => void;
}

export const TaskResultModal = ({
  isOpen,
  onClose,
  reviewCardId,
  onCompletionSuccess
}: TaskResultModalProps) => {
  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    hasEvaluated,
    canComplete,
    isLoading,
    isSaving,
    error,
    handleEvaluate,
    handleComplete
  } = useTaskResultModal({
    isOpen,
    reviewCardId,
    onClose,
    onCompletionSuccess
  });

  console.log('[TaskResultModal] Render:', currentQuestion);

  return (
    <TaskResultModalView
      isOpen={isOpen}
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      currentQuestion={currentQuestion}
      hasEvaluated={hasEvaluated}
      canComplete={canComplete}
      isLoading={isLoading}
      isSaving={isSaving}
      error={error}
      onClose={onClose}
      onEvaluate={handleEvaluate}
      onComplete={handleComplete}
    />
  );
};
