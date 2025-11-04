import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ReviewCardService } from '../../../../services/reviewCardService';
import type { ReviewCardResultResponse } from '../../../../../../../libs/api-types/src';

export interface UseReviewResultModalProps {
  isOpen: boolean;
  reviewCardId: number | null;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}

export function useReviewResultModal({ isOpen, reviewCardId, onClose, onDeleteSuccess }: UseReviewResultModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 복습 카드 결과 데이터 페칭
  const { data, isLoading, isError, error } = useQuery<ReviewCardResultResponse>({
    queryKey: ['reviewCardResults', reviewCardId],
    queryFn: () => ReviewCardService.getReviewCardResults(reviewCardId!),
    enabled: isOpen && reviewCardId !== null,
  });

  // 복습 카드 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => ReviewCardService.deleteReviewCard(reviewCardId!),
    onSuccess: () => {
      setIsDeleteConfirmOpen(false);
      handleClose();
      onDeleteSuccess?.();
    },
    onError: (error) => {
      console.error('복습 카드 삭제 실패:', error);
      setIsDeleteConfirmOpen(false);
    },
  });

  // 현재 질문 데이터
  const currentQuestion = useMemo(() => {
    if (!data?.questions || data.questions.length === 0) return null;
    return data.questions[currentQuestionIndex] || null;
  }, [data, currentQuestionIndex]);

  // 현재 답변 데이터
  const currentAnswer = useMemo(() => {
    if (!currentQuestion?.answers || currentQuestion.answers.length === 0) return null;
    return currentQuestion.answers[currentAnswerIndex] || null;
  }, [currentQuestion, currentAnswerIndex]);

  // 질문 네비게이션
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setCurrentAnswerIndex(0); // 질문 변경 시 답변 인덱스 초기화
    }
  };

  const handleNextQuestion = () => {
    if (data?.questions && currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswerIndex(0); // 질문 변경 시 답변 인덱스 초기화
    }
  };

  // 답변 네비게이션
  const handlePrevAnswer = () => {
    if (currentAnswerIndex > 0) {
      setCurrentAnswerIndex((prev) => prev - 1);
    }
  };

  const handleNextAnswer = () => {
    if (currentQuestion?.answers && currentAnswerIndex < currentQuestion.answers.length - 1) {
      setCurrentAnswerIndex((prev) => prev + 1);
    }
  };

  // 버튼 비활성화 상태
  const isPrevQuestionDisabled = currentQuestionIndex === 0;
  const isNextQuestionDisabled = !data?.questions || currentQuestionIndex === data.questions.length - 1;
  const isPrevAnswerDisabled = currentAnswerIndex === 0 || !currentQuestion?.answers || currentQuestion.answers.length === 0;
  const isNextAnswerDisabled = !currentQuestion?.answers || currentAnswerIndex === currentQuestion.answers.length - 1 || currentQuestion.answers.length === 0;

  // 모달 닫기 시 상태 초기화
  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setCurrentAnswerIndex(0);
    setIsDeleteConfirmOpen(false);
    onClose();
  };

  // 삭제 관련 핸들러
  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (reviewCardId) {
      deleteMutation.mutate();
    }
  };

  return {
    data,
    isLoading,
    isError,
    error,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    currentAnswerIndex,
    totalQuestions: data?.questions?.length || 0,
    totalAnswers: currentQuestion?.answers?.length || 0,
    handlePrevQuestion,
    handleNextQuestion,
    handlePrevAnswer,
    handleNextAnswer,
    isPrevQuestionDisabled,
    isNextQuestionDisabled,
    isPrevAnswerDisabled,
    isNextAnswerDisabled,
    handleClose,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isDeleteConfirmOpen,
    isDeleting: deleteMutation.isPending,
  };
}
