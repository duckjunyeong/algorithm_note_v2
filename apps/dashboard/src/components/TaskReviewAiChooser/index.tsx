import type { TaskReviewAiChooserProps } from './useTaskReviewAiChooserModal';
import { useTaskReviewAiChooser } from './useTaskReviewAiChooserModal';
import { TaskReviewAiChooserView } from './TaskReviewAiChooserModal.view';   

export function TaskReviewAiChooserModal({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onCancel,
  onNext,
}: TaskReviewAiChooserProps) {
  
  const { handleCancel, handleNext } = useTaskReviewAiChooser({
    onTemplateSelect, 
    onCancel,
    onNext,
  });

  return (
    <TaskReviewAiChooserView
      templates={templates}
      selectedTemplateId={selectedTemplateId}
      onTemplateSelect={onTemplateSelect} 
      onCancel={handleCancel}
      onNext={handleNext}
    />
  );
}