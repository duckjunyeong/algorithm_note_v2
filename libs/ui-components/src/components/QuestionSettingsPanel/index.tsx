import { useQuestionSettingsPanel } from './useQuestionSettingsPanel';
import { QuestionSettingsPanelView } from './QuestionSettingsPanel.view';
import type { QuestionSettingsPanelProps } from './useQuestionSettingsPanel';

export function QuestionSettingsPanel({
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  url,
  setUrl,
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
    handleUrlChange,
  } = useQuestionSettingsPanel({
    repetitionCycle,
    setRepetitionCycle,
    importance,
    setImportance,
    url,
    setUrl,
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
      url={url}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      onRepetitionCycleChange={handleRepetitionCycleChange}
      onImportanceChange={handleImportanceChange}
      onUrlChange={handleUrlChange}
      onCategorySelect={onCategorySelect}
      onAddCategoryClick={onAddCategoryClick}
    />
  );
}

export type { QuestionSettingsPanelProps };