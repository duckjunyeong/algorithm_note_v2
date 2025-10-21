import { useCallback } from 'react';

interface UseQuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}

export function useQuestionSettingsPanel({
  setRepetitionCycle,
  setImportance,
}: UseQuestionSettingsPanelProps) {
  const handleRepetitionCycleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRepetitionCycle(parseInt(e.target.value, 10));
  }, [setRepetitionCycle]);

  const handleImportanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImportance(parseInt(e.target.value, 10));
  }, [setImportance]);

  return {
    handleRepetitionCycleChange,
    handleImportanceChange,
  };
}

export interface QuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}