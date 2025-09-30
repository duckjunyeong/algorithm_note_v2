import { useQuestionSettingsPanel } from './useQuestionSettingsPanel';
import { QuestionSettingsPanelView } from './QuestionSettingsPanel.view';
import type { QuestionSettingsPanelProps } from './useQuestionSettingsPanel';

export function QuestionSettingsPanel({
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  category,
  setCategory,
  categoryColor,
  setCategoryColor
}: QuestionSettingsPanelProps) {
  const {
    handleRepetitionCycleChange,
    handleImportanceChange,
    handleCategoryChange,
    handleCategoryColorChange
  } = useQuestionSettingsPanel({
    repetitionCycle,
    setRepetitionCycle,
    importance,
    setImportance,
    category,
    setCategory,
    categoryColor,
    setCategoryColor
  });

  return (
    <QuestionSettingsPanelView
      repetitionCycle={repetitionCycle}
      importance={importance}
      category={category}
      categoryColor={categoryColor}
      onRepetitionCycleChange={handleRepetitionCycleChange}
      onImportanceChange={handleImportanceChange}
      onCategoryChange={handleCategoryChange}
      onCategoryColorChange={handleCategoryColorChange}
    />
  );
}

export type { QuestionSettingsPanelProps };