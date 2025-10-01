import { useReviewTestModal, type UseReviewTestModalProps } from './useReviewTestModal';
import { ReviewTestModalView } from './ReviewTestModal.view';

export interface ReviewTestModalProps extends UseReviewTestModalProps {}

export function ReviewTestModal({ isOpen, reviewCardId, reviewCard, onClose }: ReviewTestModalProps) {
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
    questions,
    deletedQuestionIds,
    localSettings,
    questionResults,
    handleDeleteQuestion,
    handleSettingChange,
    handleSave,
    isSaving,
  } = useReviewTestModal({ isOpen, reviewCardId, reviewCard, onClose });

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
      questions={questions}
      deletedQuestionIds={deletedQuestionIds}
      localSettings={localSettings}
      questionResults={questionResults}
      onDeleteQuestion={handleDeleteQuestion}
      onSettingChange={handleSettingChange}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
