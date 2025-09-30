import { useState, useCallback } from 'react';
import { useQuestionStore } from '../../../../store/useQuestionStore';
import { taskCreationService } from '../../../../services/taskCreationService';

type ViewType = 'input' | 'select';

export function useTaskCreationModal() {
  const [currentView, setCurrentView] = useState<ViewType>('input');
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { questions, setQuestions, clearQuestions } = useQuestionStore();

  const resetModal = useCallback(() => {
    setCurrentView('input');
    setInputValue('');
    setErrorMessage('');
    setIsLoading(false);
    clearQuestions();
  }, [clearQuestions]);

  const handleContinue = useCallback(async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage('학습하신 내용을 작성해주세요');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await taskCreationService.createAnswer(trimmedValue);
      console.log('API Response:', result);
      setQuestions(result);
      setCurrentView('select');
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : '요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, setQuestions]);

  const handleQuestionRegister = useCallback((questionId: string) => {
    // 현재 단계에서는 실제 기능 없음 - 향후 확장 지점
    console.log('Question registered:', questionId);
  }, []);

  return {
    currentView,
    inputValue,
    setInputValue,
    errorMessage,
    isLoading,
    questions,
    handleContinue,
    handleQuestionRegister,
    resetModal
  };
}