// DashboardPage/useDashboardPage.ts
import { useState, useMemo, useEffect } from 'react';
import { useReviewCardStore } from '../../store/useReviewCardStore';

export type TaskStatus = 'backlog' | 'failed' | 'done';
export interface Task { id: string; type: string; title: string; description: string; status: TaskStatus; }

export const useDashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState<boolean>(false);
  const [isReviewTestModalOpen, setIsReviewTestModalOpen] = useState<boolean>(false);
  const [selectedReviewCardId, setSelectedReviewCardId] = useState<number | null>(null);

  // 복습 카드 store 사용
  const {
    backlogCards,
    completedCards,
    isLoading: reviewCardsLoading,
    error: reviewCardsError,
    fetchReviewCards,
    clearError
  } = useReviewCardStore();

  // 페이지 마운트 시 복습 카드 목록 조회
  useEffect(() => {
    fetchReviewCards();
  }, [fetchReviewCards]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const openTaskCreationModal = () => setIsTaskCreationModalOpen(true);
  const closeTaskCreationModal = () => {
    setIsTaskCreationModalOpen(false);
    // 복습 카드 에러 상태 초기화
    if (reviewCardsError) {
      clearError();
    }
  };

  const openReviewTestModal = (reviewCardId: number) => {
    setSelectedReviewCardId(reviewCardId);
    setIsReviewTestModalOpen(true);
  };

  const closeReviewTestModal = () => {
    setIsReviewTestModalOpen(false);
    setSelectedReviewCardId(null);
  };



  return {
    isSidebarOpen,
    selectedTask,
    isConfirmModalOpen,
    isConfirmLoading,
    isTaskCreationModalOpen,
    isReviewTestModalOpen,
    selectedReviewCardId,
    // 복습 카드 관련 상태 추가
    backlogCards,
    completedCards,
    reviewCardsLoading,
    reviewCardsError,
    openConfirmModal,
    closeConfirmModal,
    openTaskCreationModal,
    closeTaskCreationModal,
    openReviewTestModal,
    closeReviewTestModal,
    toggleSidebar,
  };
};