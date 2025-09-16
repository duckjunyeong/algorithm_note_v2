import { useState } from 'react';
import { useAiNoteModalStore } from '../../../../store/useAiNoteModalStore';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'c', label: 'C', extension: 'c' },
];

export function useCodeInputView() {
  const {
    codeData,
    isLoading,
    error,
    setCodeData,
    setCurrentView,
    startAnalysis,
  } = useAiNoteModalStore();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCodeChange = (code: string) => {
    setCodeData({ code });
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleLanguageChange = (language: string) => {
    setCodeData({ language });
  };

  const handleAnalyze = async () => {
    if (!codeData.code.trim()) {
      setValidationError('Please enter your solution code');
      return;
    }

    await startAnalysis();
  };

  const handleBack = () => {
    const { submissionType } = useAiNoteModalStore.getState();
    setCurrentView(submissionType === 'url' ? 'URL_INPUT' : 'MANUAL_INPUT');
  };

  return {
    codeData,
    isLoading,
    error: error || validationError,
    languageOptions: LANGUAGE_OPTIONS,
    handleCodeChange,
    handleLanguageChange,
    handleAnalyze,
    handleBack,
  };
}