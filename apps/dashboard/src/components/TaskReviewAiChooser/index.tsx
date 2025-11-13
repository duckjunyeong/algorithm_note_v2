import type { TaskReviewAiChooserProps } from './useTaskReviewAiChooserModal';
import { useTaskReviewAiChooser } from './useTaskReviewAiChooserModal';
import { TaskReviewAiChooserView } from './TaskReviewAiChooserModal.view';

export function TaskReviewAiChooserModal({
  aiModes,
  selectedAiModeId,
  onAiModeSelect,
  onCancel,
  onNext,
}: TaskReviewAiChooserProps) {

  const { handleCancel, handleNext } = useTaskReviewAiChooser({
    onAiModeSelect,
    onCancel,
    onNext,
  });

  return (
    <TaskReviewAiChooserView
      aiModes={aiModes}
      selectedAiModeId={selectedAiModeId}
      onAiModeSelect={onAiModeSelect}
      onCancel={handleCancel}
      onNext={handleNext}
    />
  );
}