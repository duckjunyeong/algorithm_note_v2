import React, { useState, useCallback } from 'react';

export interface TemplateOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string; 
}

export interface TaskReviewAiChooserProps {
  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onTemplateSelect: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function useTaskReviewAiChooser({
  onTemplateSelect,
  onCancel,
  onNext,
}: Pick<TaskReviewAiChooserProps, 'onTemplateSelect' | 'onCancel' | 'onNext'>) {
  

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