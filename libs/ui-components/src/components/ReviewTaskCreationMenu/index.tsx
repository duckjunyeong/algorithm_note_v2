import { useReviewTaskCreationMenu } from './useReviewTaskCreationMenu';
import { ReviewTaskCreationMenuView } from './ReviewTaskCreationMenu.view';
import type { ReviewTaskCreationMenuProps } from './useReviewTaskCreationMenu';

export function ReviewTaskCreationMenu({
  onClose,
  selectedTaskType,
  onSelectTaskType,
  onConfirmTaskCreation,
  taskField,
  onTaskFieldChange,
}: ReviewTaskCreationMenuProps) {
  const {
    handleCloseClick,
    handleTaskTypeSelect,
    handleConfirmClick,
    handleTaskFieldInput,
  } = useReviewTaskCreationMenu({
    onClose,
    selectedTaskType,
    onSelectTaskType,
    onConfirmTaskCreation,
    taskField,
    onTaskFieldChange,
  });

  return (
    <ReviewTaskCreationMenuView
      onClose={handleCloseClick}
      selectedTaskType={selectedTaskType}
      onSelectTaskType={handleTaskTypeSelect}
      onConfirmTaskCreation={handleConfirmClick}
      taskField={taskField}
      onTaskFieldChange={handleTaskFieldInput}
    />
  );
}

export type { ReviewTaskCreationMenuProps };