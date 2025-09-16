import { useAiNoteModalStore } from '../../../../store/useAiNoteModalStore';

export function useChoiceView() {
  const { setSubmissionType, setCurrentView } = useAiNoteModalStore();

  const handleUrlChoice = () => {
    setSubmissionType('url');
    setCurrentView('URL_INPUT');
  };

  const handleManualChoice = () => {
    setSubmissionType('manual');
    setCurrentView('MANUAL_INPUT');
  };

  return {
    handleUrlChoice,
    handleManualChoice,
  };
}