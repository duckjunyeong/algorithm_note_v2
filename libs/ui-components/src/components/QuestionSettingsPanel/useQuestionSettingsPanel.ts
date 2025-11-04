import { useCallback } from 'react';

interface UseQuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
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
  setUrl,
}: UseQuestionSettingsPanelProps) {
  const handleRepetitionCycleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRepetitionCycle(parseInt(e.target.value, 10));
  }, [setRepetitionCycle]);

  const handleImportanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setImportance(parseInt(e.target.value, 10));
  }, [setImportance]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, [setUrl]);

  return {
    handleRepetitionCycleChange,
    handleImportanceChange,
    handleUrlChange,
  };
}

export interface QuestionSettingsPanelProps {
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}