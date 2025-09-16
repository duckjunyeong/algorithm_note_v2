import { useState, useCallback } from 'react';
import { useIncorrectAnswerNoteStore } from '../../../../store/useIncorrectAnswerNoteStore';

export function useURLInputView() {
  const { setCurrentView, setProblemData } = useIncorrectAnswerNoteStore();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleBack = useCallback(() => {
    setCurrentView('CHOICE');
  }, [setCurrentView]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  }, [error]);

  const handleNext = useCallback(() => {
    // Validate Baekjoon URL format
    const baekjoonUrlPattern = /^https:\/\/www\.acmicpc\.net\/problem\/\d+$/;

    if (!baekjoonUrlPattern.test(url)) {
      setError('Invalid Baekjoon Online Judge URL format.');
      return;
    }

    // Save URL to store
    setProblemData({ url });
    setCurrentView('CODE_INPUT');
  }, [url, setProblemData, setCurrentView]);

  return {
    url,
    error,
    handleBack,
    handleUrlChange,
    handleNext
  };
}