import { useCallback } from 'react';

interface UseQuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  categoryColor: string;
  setCategoryColor: (value: string) => void;
}

export function useQuestionSettingsPanel({
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  category,
  setCategory,
  categoryColor,
  setCategoryColor
}: UseQuestionSettingsPanelProps) {
  const handleRepetitionCycleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRepetitionCycle(parseInt(e.target.value, 10));
  }, [setRepetitionCycle]);

  const handleImportanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImportance(parseInt(e.target.value, 10));
  }, [setImportance]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  }, [setCategory]);

  const handleCategoryColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryColor(e.target.value);
  }, [setCategoryColor]);

  return {
    handleRepetitionCycleChange,
    handleImportanceChange,
    handleCategoryChange,
    handleCategoryColorChange
  };
}

export interface QuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  categoryColor: string;
  setCategoryColor: (value: string) => void;
}