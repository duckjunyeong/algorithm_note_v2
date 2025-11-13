import React, { useState, useCallback } from 'react';

export type AiMode = 'beginner-tutor' | 'advanced-tutor' | 'prof-tutor';

export interface AiModeOption {
  id: AiMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
}

export interface TaskReviewAiChooserProps {
  aiModes: AiModeOption[];
  selectedAiModeId: string | null;
  onAiModeSelect: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function useTaskReviewAiChooser({
  onAiModeSelect,
  onCancel,
  onNext,
}: Pick<TaskReviewAiChooserProps, 'onAiModeSelect' | 'onCancel' | 'onNext'>) {
  

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  return {
    handleCancel,
    handleNext,
  };
}