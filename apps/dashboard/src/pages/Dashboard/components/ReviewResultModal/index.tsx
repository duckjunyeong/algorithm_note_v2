import { useReviewResultModal, type UseReviewResultModalProps } from './useReviewResultModal';
import { ReviewResultModalView } from './ReviewResultModal.view';

export interface ReviewResultModalProps extends UseReviewResultModalProps {}

export function ReviewResultModal({ isOpen, reviewCardId, onClose, onDeleteSuccess }: ReviewResultModalProps) {
  const {
    isLoading,
    isError,
    error,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    currentAnswerIndex,
    totalQuestions,
    totalAnswers,
    isPrevQuestionDisabled,
    isNextQuestionDisabled,
    isPrevAnswerDisabled,
    isNextAnswerDisabled,
    handleClose,
    handlePrevQuestion,
    handleNextQuestion,
    handlePrevAnswer,
    handleNextAnswer,
    handleDeleteClick,
    isDeleting,
    isDeleteConfirmOpen,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useReviewResultModal({ isOpen, reviewCardId, onClose, onDeleteSuccess });

  return (
    <ReviewResultModalView
      isOpen={isOpen}
      isLoading={isLoading}
      isError={isError}
      error={error}
      currentQuestion={currentQuestion}
      currentAnswer={currentAnswer}
      currentQuestionIndex={currentQuestionIndex}
      currentAnswerIndex={currentAnswerIndex}
      totalQuestions={totalQuestions}
      totalAnswers={totalAnswers}
      isPrevQuestionDisabled={isPrevQuestionDisabled}
      isNextQuestionDisabled={isNextQuestionDisabled}
      isPrevAnswerDisabled={isPrevAnswerDisabled}
      isNextAnswerDisabled={isNextAnswerDisabled}
      onClose={handleClose}
      onPrevQuestion={handlePrevQuestion}
      onNextQuestion={handleNextQuestion}
      onPrevAnswer={handlePrevAnswer}
      onNextAnswer={handleNextAnswer}
      onDelete={handleDeleteClick}
      isDeleting={isDeleting}
      isDeleteConfirmOpen={isDeleteConfirmOpen}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
}
