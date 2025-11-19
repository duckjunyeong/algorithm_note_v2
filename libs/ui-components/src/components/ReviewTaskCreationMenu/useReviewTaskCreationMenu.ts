import { useCallback } from 'react';

export interface ReviewTaskCreationMenuProps {
  onClose: () => void;
  selectedTaskType: 'concept' | 'memorization' | 'approach';
  onSelectTaskType: (type: 'concept' | 'memorization' | 'approach') => void;
  onConfirmTaskCreation: () => void;
  taskField: string;
  onTaskFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseReviewTaskCreationMenuProps extends ReviewTaskCreationMenuProps {
  // Add any internal state or derived values if needed for the hook
}

export function useReviewTaskCreationMenu({
  onClose,
  onSelectTaskType,
  onConfirmTaskCreation,
  onTaskFieldChange,
}: UseReviewTaskCreationMenuProps) {

  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTaskTypeSelect = useCallback((type: 'concept' | 'memorization' | 'approach') => {
    onSelectTaskType(type);
    console.log('Selected task type:', type);
  }, [onSelectTaskType]);

  const handleConfirmClick = useCallback(() => {
    onConfirmTaskCreation();
  }, [onConfirmTaskCreation]);

  const handleTaskFieldInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTaskFieldChange(e);
  }, [onTaskFieldChange]);

  return {
    handleCloseClick,
    handleTaskTypeSelect,
    handleConfirmClick,
    handleTaskFieldInput,
  };
}