import { useState, useEffect } from 'react';
import { AnswerService } from '../../../../services/answerService';
import { ReviewQuestionService } from '../../../../services/reviewQuestionService';
import { ReviewCardService } from '../../../../services/reviewCardService';
import { categoryService } from '../../../../services/categoryService';
import { useReviewCardStore } from '../../../../store/useReviewCardStore';
import type { Answer, EvaluationResult } from '../../../../schemas/answer.schema';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

export interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
}

export interface UseReviewTestModalProps {
  isOpen: boolean;
  reviewCardId: number | null;
  reviewCard: any | null;
  onClose: () => void;
}

export function useReviewTestModal({ isOpen, reviewCardId, reviewCard, onClose }: UseReviewTestModalProps) {
  // Store actions for optimistic UI
  const { moveCardToCompleted, removeCard } = useReviewCardStore();

  const [currentView, setCurrentView] = useState<'input' | 'evaluation' | 'result'>('input');
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [previousAnswers, setPreviousAnswers] = useState<Answer[]>([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number>(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState<boolean>(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState<boolean>(false);

  // Result View states
  const [questionResults, setQuestionResults] = useState<Map<number, { successCount: number; failCount: number }>>(new Map());
  const [localSettings, setLocalSettings] = useState({
    category: '',
    importance: 3,
    reviewCycle: 7
  });
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Category states
  const [categories, setCategories] = useState<Array<{ categoryId: number; name: string; color: string }>>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);

  // 모달이 열릴 때 질문 목록 및 카드 설정 로드
  useEffect(() => {
    if (isOpen && reviewCardId) {
      loadQuestions(reviewCardId);
      loadCategories();
      console.log('reviewCard in modal:', reviewCard);
      if (reviewCard) {
        setLocalSettings({
          category: reviewCard.category || '',
          importance: reviewCard.importance || 3,
          reviewCycle: reviewCard.reviewCycle || 7
        });
        // If reviewCard has categoryId, set it
        if (reviewCard.categoryId) {
          setSelectedCategoryId(reviewCard.categoryId);
        }
      }
      setQuestionResults(new Map());
      setDeletedQuestionIds(new Set());
    } else {
      resetModalState();
    }
  }, [isOpen, reviewCardId, reviewCard]);

  const loadQuestions = async (cardId: number) => {
    setIsLoadingQuestions(true);
    try {
      const questions = await ReviewQuestionService.getQuestionsByReviewCardId(cardId);
      setQuestions(questions);
    } catch (error) {
      showErrorToast('질문을 불러오는데 실패했습니다.');
      onClose();
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);
    try {
      const fetchedCategories = await categoryService.fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      setCategoryError('카테고리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const resetModalState = () => {
    setCurrentView('input');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswerInput('');
    setPreviousAnswers([]);
    setCurrentAnswerIndex(0);
    setQuestionResults(new Map());
    setDeletedQuestionIds(new Set());
    setCategories([]);
    setSelectedCategoryId(null);
    setShowCategoryForm(false);
    setCategoryError(null);
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim()) {
      showErrorToast('답변을 입력해주세요.');
      return;
    }

    if (questions.length === 0) {
      showErrorToast('질문이 없습니다.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setCurrentView('evaluation');

    // 이전 질문들 불러온다. 
    await loadPreviousAnswers(currentQuestion.reviewQuestionId);
  };

  const loadPreviousAnswers = async (questionId: number) => {
    setIsLoadingAnswers(true);
    try {
      const answers = await AnswerService.getAnswersByQuestionId(questionId);
      setPreviousAnswers(answers);
      setCurrentAnswerIndex(0);
    } catch (error) {
      showErrorToast('이전 답변을 불러오는데 실패했습니다.');
      setPreviousAnswers([]);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const handlePrevAnswer = () => {
    if (currentAnswerIndex < previousAnswers.length - 1) {
      setCurrentAnswerIndex(currentAnswerIndex + 1);
    }
  };

  const handleNextAnswer = () => {
    if (currentAnswerIndex > 0) {
      setCurrentAnswerIndex(currentAnswerIndex - 1);
    }
  };

  const handleEvaluate = async (result: EvaluationResult) => {
    if (questions.length === 0) {
      showErrorToast('질문이 없습니다.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // 로컬 Map 업데이트 (질문별 카운트 증가)
    setQuestionResults(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(currentQuestion.reviewQuestionId) || { successCount: 0, failCount: 0 };

      if (result === 'SUCCESS') {
        current.successCount++;
      } else {
        current.failCount++;
      }

      newMap.set(currentQuestion.reviewQuestionId, current);
      return newMap;
    });

    // 마지막 질문인지 확인
    if (currentQuestionIndex === questions.length - 1) {
      // Result View로 전환
      setCurrentView('result');
      showSuccessToast('테스트가 종료되었습니다.');
    } else {
      // 다음 질문으로 이동
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerInput('');
      setCurrentView('input');
      setPreviousAnswers([]);
    }
  };

  // Result View handlers
  const handleDeleteQuestion = (questionId: number) => {
    setDeletedQuestionIds(prev => new Set(prev).add(questionId));
  };

  const handleSettingChange = (field: string, value: string | number) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Category handlers
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
  };

  const handleSaveCategory = async (name: string, color: string) => {
    try {
      const newCategory = await categoryService.createCategory({ name, color });
      setCategories(prev => [...prev, newCategory]);
      setSelectedCategoryId(newCategory.categoryId);
      setShowCategoryForm(false);
      showSuccessToast('카테고리가 생성되었습니다.');
    } catch (error) {
      showErrorToast('카테고리 생성에 실패했습니다.');
      throw error;
    }
  };

  const handleSave = async () => {
    if (!reviewCardId) return;

    setIsSaving(true);

    const remainingQuestions = questions.filter(
      q => !deletedQuestionIds.has(q.reviewQuestionId)
    );
    const isCardDeleted = remainingQuestions.length === 0;

    // 낙관적 UI 업데이트: API 호출 전에 store 상태 변경
    if (isCardDeleted) {
      removeCard(reviewCardId);
    } else {
      moveCardToCompleted(reviewCardId);
    }

    try {
      if (isCardDeleted) {
        // 카드 전체 삭제
        await ReviewCardService.deleteReviewCard(reviewCardId);
        showSuccessToast('복습 카드가 삭제되었습니다.');
      } else {
        // Map을 questionUpdates 배열로 변환
        const questionUpdates = Array.from(questionResults.entries()).map(([questionId, counts]) => ({
          reviewQuestionId: questionId,
          successCount: counts.successCount,
          failCount: counts.failCount
        }));

        // 카드 업데이트
        await ReviewCardService.updateReviewResult(reviewCardId, {
          title: reviewCard?.title,
          category: localSettings.category,
          importance: localSettings.importance,
          reviewCycle: localSettings.reviewCycle,
          isActive: false,
          deletedQuestionIds: Array.from(deletedQuestionIds),
          questionUpdates
        });
        showSuccessToast('저장되었습니다.');
      }

      onClose();
    } catch (error) {
      // 롤백: API 실패 시 store 재조회로 원상복구
      showErrorToast('저장에 실패했습니다.');
      const { fetchReviewCards } = useReviewCardStore.getState();
      await fetchReviewCards();
    } finally {
      setIsSaving(false);
    }
  };

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isPrevAnswerDisabled = currentAnswerIndex >= previousAnswers.length - 1;
  const isNextAnswerDisabled = currentAnswerIndex <= 0;

  return {
    currentView,
    currentQuestion,
    answerInput,
    setAnswerInput,
    previousAnswers,
    currentAnswerIndex,
    isLoadingQuestions,
    isLoadingAnswers,
    isSavingAnswer,
    isPrevAnswerDisabled,
    isNextAnswerDisabled,
    handleSubmitAnswer,
    handlePrevAnswer,
    handleNextAnswer,
    handleEvaluate,
    // Result View
    questions,
    deletedQuestionIds,
    localSettings,
    questionResults,
    handleDeleteQuestion,
    handleSettingChange,
    handleSave,
    isSaving,
    // Category
    categories,
    selectedCategoryId,
    isLoadingCategories,
    categoryError,
    showCategoryForm,
    handleCategorySelect,
    handleAddCategoryClick,
    handleCloseCategoryForm,
    handleSaveCategory,
  };
}
