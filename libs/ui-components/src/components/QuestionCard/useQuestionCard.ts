import { useState, useCallback } from 'react';

interface UseQuestionCardProps {
  questionId: number;
  onEdit?: (questionId: number) => void;
  onDelete?: (questionId: number) => void;
  onQuestionClick?: () => void;
}

export function useQuestionCard({
  questionId,
  onEdit,
  onDelete,
  onQuestionClick
}: UseQuestionCardProps) {
  const [isLoading] = useState(false);

  const handleEdit = useCallback(() => {
    if (isLoading) return;
    onEdit?.(questionId);
  }, [questionId, onEdit, isLoading]);

  const handleDelete = useCallback(() => {
    if (isLoading) return;
    onDelete?.(questionId);
  }, [questionId, onDelete, isLoading]);

  return {
    isLoading,
    handleEdit,
    handleDelete,
    onQuestionClick
  };
}

export interface QuestionCardProps {
  questionId: number;
  question: string;
  onEdit?: (questionId: number) => void;
  onDelete?: (questionId: number) => void;
  onQuestionClick?: () => void;
}