import { useState, useEffect } from 'react';
import { AnswerService } from '../../../../services/answerService';
import { ReviewQuestionService } from '../../../../services/reviewQuestionService';
import { ReviewCardService } from '../../../../services/reviewCardService';
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
  const [localSuccessCount, setLocalSuccessCount] = useState<number>(0);
  const [localFailCount, setLocalFailCount] = useState<number>(0);
  const [localSettings, setLocalSettings] = useState({
    category: '',
    importance: 3,
    reviewCycle: 7
  });
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 모달이 열릴 때 질문 목록 및 카드 설정 로드
  useEffect(() => {
    if (isOpen && reviewCardId) {
      loadQuestions(reviewCardId);
      if (reviewCard) {
        setLocalSettings({
          category: reviewCard.category || '',
          importance: reviewCard.importance || 3,
          reviewCycle: reviewCard.reviewCycle || 7
        });
      }
      setLocalSuccessCount(0);
      setLocalFailCount(0);
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

  const resetModalState = () => {
    setCurrentView('input');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswerInput('');
    setPreviousAnswers([]);
    setCurrentAnswerIndex(0);
    setLocalSuccessCount(0);
    setLocalFailCount(0);
    setDeletedQuestionIds(new Set());
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

    // 로컬 카운트만 증가 (API 호출 없음)
    if (result === 'SUCCESS') {
      setLocalSuccessCount(prev => prev + 1);
    } else {
      setLocalFailCount(prev => prev + 1);
    }

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

  const handleSave = async () => {
    if (!reviewCardId) return;

    setIsSaving(true);
    try {
      const remainingQuestions = questions.filter(
        q => !deletedQuestionIds.has(q.reviewQuestionId)
      );
      const isCardDeleted = remainingQuestions.length === 0;

      if (isCardDeleted) {
        // 카드 전체 삭제
        await ReviewCardService.deleteReviewCard(reviewCardId);
        showSuccessToast('복습 카드가 삭제되었습니다.');
      } else {
        // 카드 업데이트
        await ReviewCardService.updateReviewResult(reviewCardId, {
          title: reviewCard?.title,
          category: localSettings.category,
          importance: localSettings.importance,
          reviewCycle: localSettings.reviewCycle,
          successCount: localSuccessCount,
          failCount: localFailCount,
          deletedQuestionIds: Array.from(deletedQuestionIds),
          isActive: false
        });
        showSuccessToast('저장되었습니다.');
      }

      onClose();
    } catch (error) {
      showErrorToast('저장에 실패했습니다.');
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
    localCounts: { successCount: localSuccessCount, failCount: localFailCount },
    handleDeleteQuestion,
    handleSettingChange,
    handleSave,
    isSaving,
  };
}
