import { useState, useCallback } from 'react';

interface UseQuestionCardProps {
  questionId: string;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
}

export function useQuestionCard({ questionId, onEdit, onDelete }: UseQuestionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

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
    handleDelete
  };
}

export interface QuestionCardProps {
  questionId: string;
  question: string;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
}