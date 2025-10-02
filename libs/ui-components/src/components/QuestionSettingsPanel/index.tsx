import { useQuestionSettingsPanel } from './useQuestionSettingsPanel';
import { QuestionSettingsPanelView } from './QuestionSettingsPanel.view';
import type { QuestionSettingsPanelProps } from './useQuestionSettingsPanel';

export function QuestionSettingsPanel({
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  onCategorySelect,
  onAddCategoryClick,
}: QuestionSettingsPanelProps) {
  const {
    handleRepetitionCycleChange,
    handleImportanceChange,
  } = useQuestionSettingsPanel({
    repetitionCycle,
    setRepetitionCycle,
    importance,
    setImportance,
    categories,
    selectedCategoryId,
    isLoadingCategories,
    categoryError,
    onCategorySelect,
    onAddCategoryClick,
  });

  return (
    <QuestionSettingsPanelView
      repetitionCycle={repetitionCycle}
      importance={importance}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      onRepetitionCycleChange={handleRepetitionCycleChange}
      onImportanceChange={handleImportanceChange}
      onCategorySelect={onCategorySelect}
      onAddCategoryClick={onAddCategoryClick}
    />
  );
}

export type { QuestionSettingsPanelProps };