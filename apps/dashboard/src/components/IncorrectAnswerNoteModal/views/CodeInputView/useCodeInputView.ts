import { useState, useCallback, useMemo } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { useIncorrectAnswerNoteStore } from '../../../../store/useIncorrectAnswerNoteStore';
import { analysisService } from '../../../../services/analysisService';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' }
];

export function useCodeInputView() {
  const {
    codeData,
    problemData,
    submissionType,
    isLoading,
    setCurrentView,
    setCodeData,
    setLoading,
    setError,
    setAnalysisResult
  } = useIncorrectAnswerNoteStore();

  const [localCode, setLocalCode] = useState(codeData.code);
  const [localLanguage, setLocalLanguage] = useState(codeData.language);

  const handleBack = useCallback(() => {
    // Save current code data before going back
    setCodeData({ code: localCode, language: localLanguage });

    if (submissionType === 'url') {
      setCurrentView('URL_INPUT');
    } else {
      setCurrentView('MANUAL_INPUT');
    }
  }, [localCode, localLanguage, submissionType, setCodeData, setCurrentView]);

  const handleCodeChange = useCallback((value: string) => {
    setLocalCode(value);
  }, []);

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalLanguage(e.target.value);
  }, []);

  const getLanguageExtension = useCallback((language: string) => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'python':
        return python();
      case 'java':
        return java();
      case 'cpp':
        return cpp();
      default:
        return javascript();
    }
  }, []);

  const extensions = useMemo(() => [getLanguageExtension(localLanguage)], [localLanguage, getLanguageExtension]);

  const handleAnalyze = useCallback(async () => {
    if (!localCode.trim()) return;

    setLoading(true);
    setError(null);

    // Save code data to store
    setCodeData({ code: localCode, language: localLanguage });

    try {
      let response;

      if (submissionType === 'url') {
        response = await analysisService.analyzeByUrl({
          url: problemData.url || '',
          code: localCode,
          language: localLanguage
        });
      } else {
        response = await analysisService.analyzeByManual({
          problemData: problemData as any, // Type assertion for now
          code: localCode,
          language: localLanguage
        });
      }

      if (response.success && response.data) {
        setAnalysisResult(response.data);
        setCurrentView('RESULTS');
      } else {
        setError(response.message || 'Analysis failed');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  }, [localCode, localLanguage, submissionType, problemData, setCodeData, setLoading, setError, setAnalysisResult, setCurrentView]);

  return {
    localCode,
    localLanguage,
    extensions,
    isLoading,
    languageOptions: LANGUAGE_OPTIONS,
    handleBack,
    handleCodeChange,
    handleLanguageChange,
    handleAnalyze
  };
}