import { useQuestionEditModal } from './useQuestionEditModal';
import { QuestionEditModalView } from './QuestionEditModal.view';
import type { QuestionEditModalProps } from './useQuestionEditModal';

export function QuestionEditModal({
  isOpen,
  questionId,
  initialQuestion,
  onSave,
  onClose
}: QuestionEditModalProps) {
  const {
    questionText,
    setQuestionText,
    errorMessage,
    isLoading,
    handleSave,
    handleClose,
    handleBackgroundClick
  } = useQuestionEditModal({
    isOpen,
    initialQuestion,
    onSave: questionId && onSave ? (newQuestion: string) => onSave(questionId, newQuestion) : undefined,
    onClose
  });

  return (
    <QuestionEditModalView
      isOpen={isOpen}
      questionText={questionText}
      setQuestionText={setQuestionText}
      errorMessage={errorMessage}
      isLoading={isLoading}
      onSave={handleSave}
      onClose={handleClose}
      onBackgroundClick={handleBackgroundClick}
    />
  );
}

export type { QuestionEditModalProps };