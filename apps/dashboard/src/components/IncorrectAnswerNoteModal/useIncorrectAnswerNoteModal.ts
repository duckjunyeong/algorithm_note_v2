import { useIncorrectAnswerNoteStore } from '../../store/useIncorrectAnswerNoteStore';

export function useIncorrectAnswerNoteModal() {
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
    closeModal,
    showExitConfirmation,
    hideExitConfirmation,
    setCurrentView,
    setSubmissionType,
    setProblemData,
    setCodeData,
    setSelectedAnalysisIndex,
    analyzeCode,
  } = useIncorrectAnswerNoteStore();

  const handleOverlayClick = () => {
    showExitConfirmation();
  };

  const handleExitConfirm = () => {
    hideExitConfirmation();
    closeModal();
  };

  const handleExitCancel = () => {
    hideExitConfirmation();
  };

  const handleBackClick = () => {
    switch (currentView) {
      case 'URL_INPUT':
      case 'MANUAL_INPUT':
        setCurrentView('CHOICE');
        break;
      case 'CODE_INPUT':
        setCurrentView(submissionType === 'url' ? 'URL_INPUT' : 'MANUAL_INPUT');
        break;
      case 'RESULTS':
        setCurrentView('CODE_INPUT');
        break;
      default:
        break;
    }
  };

  const handleChoiceSelect = (type: 'url' | 'manual') => {
    setSubmissionType(type);
    setCurrentView(type === 'url' ? 'URL_INPUT' : 'MANUAL_INPUT');
  };

  const handleNextClick = () => {
    if (currentView === 'URL_INPUT' || currentView === 'MANUAL_INPUT') {
      setCurrentView('CODE_INPUT');
    }
  };

  const handleAnalyzeClick = () => {
    analyzeCode();
  };

  const handleAnalysisSelect = (index: number) => {
    setSelectedAnalysisIndex(index);
  };

  const handleGenerateNote = () => {
    if (analysisResult.length > 0 && analysisResult[selectedAnalysisIndex]) {
      const selectedLogic = analysisResult[selectedAnalysisIndex];
      console.log({
        title: selectedLogic.title,
        description: selectedLogic.description,
        code: selectedLogic.code,
      });
    }
  };

  return {
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
  };
}