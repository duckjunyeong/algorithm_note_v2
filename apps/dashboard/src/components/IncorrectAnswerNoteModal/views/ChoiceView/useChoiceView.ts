import { useCallback } from 'react';
import { useIncorrectAnswerNoteStore } from '../../../../store/useIncorrectAnswerNoteStore';

export function useChoiceView() {
  const { setSubmissionType, setCurrentView } = useIncorrectAnswerNoteStore();

  const handleUrlSelection = useCallback(() => {
    setSubmissionType('url');
    setCurrentView('URL_INPUT');
  }, [setSubmissionType, setCurrentView]);

  const handleManualSelection = useCallback(() => {
    setSubmissionType('manual');
    setCurrentView('MANUAL_INPUT');
  }, [setSubmissionType, setCurrentView]);

  return {
    handleUrlSelection,
    handleManualSelection
  };
}