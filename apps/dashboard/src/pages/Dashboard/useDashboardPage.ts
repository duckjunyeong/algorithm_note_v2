// DashboardPage/useDashboardPage.ts
import { useState, useMemo, useEffect } from 'react';
import { useReviewCardStore } from '../../store/useReviewCardStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { categoryService } from '../../services/categoryService';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

export type TaskStatus = 'backlog' | 'failed' | 'done';
export interface Task { id: string; type: string; title: string; description: string; status: TaskStatus; }

export const useDashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState<boolean>(false);
  const [isTaskCreationConfirmOpen, setIsTaskCreationConfirmOpen] = useState<boolean>(false);
  const [isReviewTestModalOpen, setIsReviewTestModalOpen] = useState<boolean>(false);
  const [selectedReviewCardId, setSelectedReviewCardId] = useState<number | null>(null);

  // Category 관련 상태
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // 복습 카드 store 사용
  const {
    backlogCards,
    completedCards,
    isLoading: reviewCardsLoading,
    error: reviewCardsError,
    fetchReviewCards,
    clearError
  } = useReviewCardStore();

  // Category store 사용
  const { categories, setCategories, addCategory } = useCategoryStore();

  // 페이지 마운트 시 복습 카드 목록 및 카테고리 조회
  useEffect(() => {
    fetchReviewCards();
    loadCategories();
  }, [fetchReviewCards]);

  // 카테고리 목록 조회
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);
    try {
      const categories = await categoryService.fetchCategories();
      setCategories(categories);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '카테고리 목록을 불러오는데 실패했습니다.';
      setCategoryError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // 카테고리 생성
  const handleSaveCategory = async (name: string, color: string) => {
    try {
      const newCategory = await categoryService.createCategory({ name, color });
      addCategory(newCategory);
      showSuccessToast('카테고리가 생성되었습니다.');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '카테고리 생성에 실패했습니다.';
      showErrorToast(errorMsg);
      throw error;
    }
  };

  // selectedReviewCardId에 해당하는 reviewCard 찾기
  const selectedReviewCard = useMemo(() => {
    if (!selectedReviewCardId) return null;

    const card = backlogCards.find(card => card.reviewCardId === selectedReviewCardId) ||
                 completedCards.find(card => card.reviewCardId === selectedReviewCardId);

    return card || null;
  }, [selectedReviewCardId, backlogCards, completedCards]);

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

  // TaskCreationModal 배경 클릭 시 ConfirmModal 열기
  const handleTaskCreationBackgroundClick = () => {
    setIsTaskCreationConfirmOpen(true);
  };

  // ConfirmModal에서 "확인" 클릭 시 TaskCreationModal 닫기
  const handleConfirmTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
    closeTaskCreationModal();
  };

  // ConfirmModal에서 "취소" 클릭 시 ConfirmModal만 닫기
  const handleCancelTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
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
    isTaskCreationConfirmOpen,
    isReviewTestModalOpen,
    selectedReviewCardId,
    selectedReviewCard,
    // 복습 카드 관련 상태 추가
    backlogCards,
    completedCards,
    reviewCardsLoading,
    reviewCardsError,
    // Category 관련 상태 추가
    categories,
    isLoadingCategories,
    categoryError,
    openConfirmModal,
    closeConfirmModal,
    openTaskCreationModal,
    closeTaskCreationModal,
    handleTaskCreationBackgroundClick,
    handleConfirmTaskCreationClose,
    handleCancelTaskCreationClose,
    openReviewTestModal,
    closeReviewTestModal,
    handleSaveCategory,
    toggleSidebar,
  };
};