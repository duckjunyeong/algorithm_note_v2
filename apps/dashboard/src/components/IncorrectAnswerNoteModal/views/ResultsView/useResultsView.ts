import { useCallback, useMemo } from 'react';
import { useIncorrectAnswerNoteStore } from '../../../../store/useIncorrectAnswerNoteStore';

export function useResultsView() {
  const {
    analysisResult,
    selectedLogicId,
    setSelectedLogicId
  } = useIncorrectAnswerNoteStore();

  const selectedLogic = useMemo(() => {
    return analysisResult.find(logic => logic.id === selectedLogicId);
  }, [analysisResult, selectedLogicId]);

  const handleLogicSelect = useCallback((id: string) => {
    setSelectedLogicId(id);
  }, [setSelectedLogicId]);

  const handleGenerate = useCallback(() => {
    if (selectedLogic) {
      console.log('Selected Logic:', {
        title: selectedLogic.title,
        description: selectedLogic.description,
        code: selectedLogic.code
      });
    }
  }, [selectedLogic]);

  return {
    analysisResult,
    selectedLogic,
    selectedLogicId,
    handleLogicSelect,
    handleGenerate
  };
}