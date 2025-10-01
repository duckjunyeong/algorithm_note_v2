import { useReviewTestModal, type UseReviewTestModalProps } from './useReviewTestModal';
import { ReviewTestModalView } from './ReviewTestModal.view';

export interface ReviewTestModalProps extends UseReviewTestModalProps {}

export function ReviewTestModal({ isOpen, reviewCardId, onClose }: ReviewTestModalProps) {
  const {
    currentView,
    currentQuestion,
    answerInput,
    setAnswerInput,
    previousAnswers,
    currentAnswerIndex,
    isLoadingQuestions,
    isLoadingAnswers,
    isSavingAnswer,
    isPrevAnswerDisabled,
    isNextAnswerDisabled,
    handleSubmitAnswer,
    handlePrevAnswer,
    handleNextAnswer,
    handleEvaluate,
  } = useReviewTestModal({ isOpen, reviewCardId, onClose });

  return (
    <ReviewTestModalView
      isOpen={isOpen}
      onClose={onClose}
      currentView={currentView}
      currentQuestion={currentQuestion}
      answerInput={answerInput}
      setAnswerInput={setAnswerInput}
      previousAnswers={previousAnswers}
      currentAnswerIndex={currentAnswerIndex}
      isLoadingQuestions={isLoadingQuestions}
      isLoadingAnswers={isLoadingAnswers}
      isSavingAnswer={isSavingAnswer}
      isPrevAnswerDisabled={isPrevAnswerDisabled}
      isNextAnswerDisabled={isNextAnswerDisabled}
      onSubmitAnswer={handleSubmitAnswer}
      onPrevAnswer={handlePrevAnswer}
      onNextAnswer={handleNextAnswer}
      onEvaluate={handleEvaluate}
    />
  );
}
