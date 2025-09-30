import { useState, useCallback } from 'react';

interface UseQuestionCardProps {
  questionId: string;
  onRegister?: (questionId: string) => void;
}

export function useQuestionCard({ questionId, onRegister }: UseQuestionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      onRegister?.(questionId);
    } finally {
      setIsLoading(false);
    }
  }, [questionId, onRegister, isLoading]);

  return {
    isLoading,
    handleRegister
  };
}

export interface QuestionCardProps {
  questionId: string;
  question: string;
  onRegister?: (questionId: string) => void;
}