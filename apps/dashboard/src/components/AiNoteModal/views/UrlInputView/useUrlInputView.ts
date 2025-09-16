import { useState } from 'react';
import { useAiNoteModalStore } from '../../../../store/useAiNoteModalStore';

export function useUrlInputView() {
  const { problemData, setProblemData, setCurrentView } = useAiNoteModalStore();
  const [url, setUrl] = useState(problemData.url || '');
  const [error, setError] = useState<string | null>(null);

  const validateBaekjoonUrl = (url: string): boolean => {
    const baekjoonPattern = /^https?:\/\/(www\.)?acmicpc\.net\/problem\/\d+\/?$/;
    return baekjoonPattern.test(url);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (error) {
      setError(null);
    }
  };

  const handleNext = () => {
    if (!url.trim()) {
      setError('Please enter a problem URL');
      return;
    }

    if (!validateBaekjoonUrl(url)) {
      setError('Please enter a valid Baekjoon Online Judge URL (e.g., https://www.acmicpc.net/problem/1000)');
      return;
    }

    setProblemData({ url: url.trim() });
    setCurrentView('CODE_INPUT');
  };

  const handleBack = () => {
    setCurrentView('CHOICE');
  };

  return {
    url,
    error,
    handleUrlChange,
    handleNext,
    handleBack,
  };
}