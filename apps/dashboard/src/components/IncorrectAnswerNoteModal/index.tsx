import { useIncorrectAnswerNoteModal } from './useIncorrectAnswerNoteModal';
import { IncorrectAnswerNoteModalView } from './IncorrectAnswerNoteModal.view';

export function IncorrectAnswerNoteModal() {
  const {
    isModalOpen,
    isExitConfirmationVisible,
    currentView,
    problemData,
    submissionType,
    codeData,
    analysisResult,
    selectedAnalysisIndex,
    isLoading,
    error,
    handleOverlayClick,
    handleExitConfirm,
    handleExitCancel,
    handleBackClick,
    handleChoiceSelect,
    handleNextClick,
    handleAnalyzeClick,
    handleAnalysisSelect,
    handleGenerateNote,
    setProblemData,
    setCodeData,
  } = useIncorrectAnswerNoteModal();

  return (
    <IncorrectAnswerNoteModalView
      isModalOpen={isModalOpen}
      isExitConfirmationVisible={isExitConfirmationVisible}
      currentView={currentView}
      problemData={problemData}
      submissionType={submissionType}
      codeData={codeData}
      analysisResult={analysisResult}
      selectedAnalysisIndex={selectedAnalysisIndex}
      isLoading={isLoading}
      error={error}
      onOverlayClick={handleOverlayClick}
      onExitConfirm={handleExitConfirm}
      onExitCancel={handleExitCancel}
      onBackClick={handleBackClick}
      onChoiceSelect={handleChoiceSelect}
      onNext={handleNextClick}
      onAnalyze={handleAnalyzeClick}
      onAnalysisSelect={handleAnalysisSelect}
      onGenerateNote={handleGenerateNote}
      onProblemDataChange={setProblemData}
      onCodeDataChange={setCodeData}
    />
  );
}