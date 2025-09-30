import { useState, useCallback, useEffect } from 'react';

interface UseQuestionEditModalProps {
  isOpen: boolean;
  initialQuestion?: string;
  onSave?: (newQuestion: string) => void;
  onClose?: () => void;
}

export function useQuestionEditModal({
  isOpen,
  initialQuestion = '',
  onSave,
  onClose
}: UseQuestionEditModalProps) {
  const [questionText, setQuestionText] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuestionText(initialQuestion);
      setErrorMessage('');
    }
  }, [isOpen, initialQuestion]);

  const handleSave = useCallback(() => {
    const trimmedText = questionText.trim();

    if (!trimmedText) {
      setErrorMessage('질문을 입력해주세요');
      return;
    }

    if (trimmedText === initialQuestion.trim()) {
      setErrorMessage('변경된 내용이 없습니다');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      onSave?.(trimmedText);
      onClose?.();
    } finally {
      setIsLoading(false);
    }
  }, [questionText, initialQuestion, onSave, onClose]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose?.();
  }, [isLoading, onClose]);

  const handleBackgroundClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return {
    questionText,
    setQuestionText,
    errorMessage,
    isLoading,
    handleSave,
    handleClose,
    handleBackgroundClick
  };
}

export interface QuestionEditModalProps {
  isOpen: boolean;
  questionId?: number;
  initialQuestion?: string;
  onSave?: (questionId: number, newQuestion: string) => void;
  onClose?: () => void;
}