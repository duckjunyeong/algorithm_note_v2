import { useState, useCallback } from 'react';
import { useQuestionStore } from '../../../../store/useQuestionStore';
import { useReviewCardStore } from '../../../../store/useReviewCardStore';
import { taskCreationService } from '../../../../services/taskCreationService';

type ViewType = 'input' | 'select';

export function useTaskCreationModal() {
  const [currentView, setCurrentView] = useState<ViewType>('input');
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 수정/삭제 상태 관리
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; text: string } | null>(null);

  // 질문 설정 상태 관리
  const [repetitionCycle, setRepetitionCycle] = useState(3);
  const [importance, setImportance] = useState(5);
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('#3B82F6');

  const { questions, setQuestions, clearQuestions } = useQuestionStore();
  const { createReviewCard } = useReviewCardStore();

  const resetModal = useCallback(() => {
    setCurrentView('input');
    setInputValue('');
    setErrorMessage('');
    setIsLoading(false);
    setSelectedQuestions(new Set());
    setEditingQuestion(null);
    setRepetitionCycle(3);
    setImportance(5);
    setCategory('');
    setCategoryColor('#3B82F6');
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

  // 질문 선택/해제
  const handleQuestionToggle = useCallback((questionId: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // 질문 수정 시작
  const handleQuestionEdit = useCallback((questionId: string) => {
    if (!questions) return;

    const question = questions.questions.find(q => q.id === questionId);
    if (question) {
      setEditingQuestion({ id: question.id, text: question.text });
    }
  }, [questions]);

  // 질문 수정 저장
  const handleQuestionSave = useCallback((questionId: string, newText: string) => {
    if (!questions) return;

    const updatedQuestions = {
      ...questions,
      questions: questions.questions.map(q =>
        q.id === questionId ? { ...q, text: newText } : q
      )
    };

    setQuestions(updatedQuestions);
    setEditingQuestion(null);
  }, [questions, setQuestions]);

  // 질문 삭제
  const handleQuestionDelete = useCallback((questionId: string) => {
    if (!questions) return;

    const updatedQuestions = {
      ...questions,
      questions: questions.questions.filter(q => q.id !== questionId)
    };

    setQuestions(updatedQuestions);

    // 선택 목록에서도 제거
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  }, [questions, setQuestions]);

  // 수정 모달 닫기
  const handleEditModalClose = useCallback(() => {
    setEditingQuestion(null);
  }, []);

  // 선택된 질문들 등록
  const handleRegisterSelectedQuestions = useCallback(async () => {
    if (selectedQuestions.size === 0) {
      setErrorMessage('등록할 질문을 선택해주세요');
      return;
    }

    if (!questions) {
      setErrorMessage('질문 데이터가 없습니다');
      return;
    }

    if (!category.trim()) {
      setErrorMessage('카테고리를 입력해주세요');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // 선택된 질문들만 필터링
      const selectedQuestionTexts = questions.questions
        .filter(q => selectedQuestions.has(q.id))
        .map(q => ({ text: q.text }));

      // 복습 카드 생성 요청 데이터 구성
      const reviewCardData = {
        title: questions.title,
        category: category.trim(),
        importance,
        reviewCycle: repetitionCycle,
        questions: selectedQuestionTexts
      };

      await createReviewCard(reviewCardData);

      // 성공시 모달 상태 리셋
      resetModal();
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : '복습 카드 생성에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuestions, questions, category, importance, repetitionCycle, createReviewCard, resetModal]);

  return {
    currentView,
    inputValue,
    setInputValue,
    errorMessage,
    isLoading,
    questions,
    selectedQuestions,
    editingQuestion,
    repetitionCycle,
    setRepetitionCycle,
    importance,
    setImportance,
    category,
    setCategory,
    categoryColor,
    setCategoryColor,
    handleContinue,
    handleQuestionToggle,
    handleQuestionEdit,
    handleQuestionSave,
    handleQuestionDelete,
    handleEditModalClose,
    handleRegisterSelectedQuestions,
    resetModal
  };
}