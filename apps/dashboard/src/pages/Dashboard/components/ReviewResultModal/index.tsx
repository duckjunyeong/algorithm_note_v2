import { useReviewResultModal, type UseReviewResultModalProps } from './useReviewResultModal';
import { ReviewResultModalView } from './ReviewResultModal.view';

export interface ReviewResultModalProps extends UseReviewResultModalProps {}

export function ReviewResultModal({ isOpen, reviewCardId, onClose }: ReviewResultModalProps) {
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
  } = useReviewResultModal({ isOpen, reviewCardId, onClose });

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
    />
  );
}
