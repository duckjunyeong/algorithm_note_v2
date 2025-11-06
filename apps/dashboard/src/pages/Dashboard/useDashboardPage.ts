// DashboardPage/useDashboardPage.ts
import { useState, useMemo, useEffect } from 'react';
import { useReviewCardStore } from '../../store/useReviewCardStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { categoryService } from '../../services/categoryService';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { sortBySuccessRate, sortByImportance, filterByCategory } from '../../utils/reviewCardUtils';

export type TaskStatus = 'backlog' | 'failed' | 'done';
export interface Task { id: string; type: string; title: string; description: string; status: TaskStatus; }

export const useDashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedTask] = useState<Task | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isConfirmLoading] = useState<boolean>(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState<boolean>(false);
  const [isTaskCreationConfirmOpen, setIsTaskCreationConfirmOpen] = useState<boolean>(false);
  const [isReviewFlowModalOpen, setIsReviewFlowModalOpen] = useState<boolean>(false);
  const [selectedReviewCardId, setSelectedReviewCardId] = useState<number | null>(null);
  const [isReviewResultModalOpen, setIsReviewResultModalOpen] = useState<boolean>(false);
  const [selectedResultReviewCardId, setSelectedResultReviewCardId] = useState<number | null>(null);
  const [isExamSheetModalOpen, setIsExamSheetModalOpen] = useState<boolean>(false);

  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [backlogFilterCategoryId, setBacklogFilterCategoryId] = useState<number | null>(null);
  const [backlogSortBy, setBacklogSortBy] = useState<'successRate' | 'importance'>('successRate');

  const [completedFilterCategoryId, setCompletedFilterCategoryId] = useState<number | null>(null);
  const [completedSortBy, setCompletedSortBy] = useState<'successRate' | 'importance'>('successRate');

  const {
    backlogCards,
    completedCards,
    isLoading: reviewCardsLoading,
    error: reviewCardsError,
    fetchReviewCards,
    clearError,
    removeCard
  } = useReviewCardStore();

  const { categories, setCategories, addCategory } = useCategoryStore();

  useEffect(() => {
    fetchReviewCards();
    loadCategories();
  }, [fetchReviewCards]);

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

  const filteredBacklogCards = useMemo(() => {
    let result = filterByCategory(backlogCards, backlogFilterCategoryId);

    result = backlogSortBy === 'successRate'
      ? sortBySuccessRate(result, 'asc') 
      : sortByImportance(result, 'desc'); 

    return result;
  }, [backlogCards, backlogFilterCategoryId, backlogSortBy]);

  const filteredCompletedCards = useMemo(() => {
    let result = filterByCategory(completedCards, completedFilterCategoryId);

    result = completedSortBy === 'successRate'
      ? sortBySuccessRate(result, 'desc')  
      : sortByImportance(result, 'desc');

    return result;
  }, [completedCards, completedFilterCategoryId, completedSortBy]);

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
    if (reviewCardsError) {
      clearError();
    }
  };

  const handleTaskCreationBackgroundClick = () => {
    setIsTaskCreationConfirmOpen(true);
  };

  const handleConfirmTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
    closeTaskCreationModal();
  };

  const handleCancelTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
  };

  const openReviewFlowModal = (reviewCardId: number) => {
    setSelectedReviewCardId(reviewCardId);
    setIsReviewFlowModalOpen(true);
  };

  const closeReviewFlowModal = () => {
    setIsReviewFlowModalOpen(false);
    setSelectedReviewCardId(null);
  };

  const openReviewResultModal = (reviewCardId: number) => {
    setSelectedResultReviewCardId(reviewCardId);
    setIsReviewResultModalOpen(true);
    console.log('Opening ReviewResultModal for reviewCardId:', reviewCardId);
  };

  const closeReviewResultModal = () => {
    setIsReviewResultModalOpen(false);
    setSelectedResultReviewCardId(null);
  };

  const handleReviewCardDeleteSuccess = () => {
    if (selectedResultReviewCardId) {
      removeCard(selectedResultReviewCardId);
      showSuccessToast('복습 카드가 삭제되었습니다.');
    }
  };

  const openExamSheetModal = () => {
    setIsExamSheetModalOpen(true);
  };

  const closeExamSheetModal = () => {
    setIsExamSheetModalOpen(false);
  };

  return {
    isSidebarOpen,
    selectedTask,
    isConfirmModalOpen,
    isConfirmLoading,
    isTaskCreationModalOpen,
    isTaskCreationConfirmOpen,
    isReviewFlowModalOpen,
    selectedReviewCardId,
    selectedReviewCard,
    backlogCards: filteredBacklogCards, 
    completedCards: filteredCompletedCards,  
    reviewCardsLoading,
    reviewCardsError,
    categories,
    isLoadingCategories,
    categoryError,
    backlogFilterCategoryId,
    backlogSortBy,
    setBacklogFilterCategoryId,
    setBacklogSortBy,
    completedFilterCategoryId,
    completedSortBy,
    setCompletedFilterCategoryId,
    setCompletedSortBy,
    openConfirmModal,
    closeConfirmModal,
    openTaskCreationModal,
    closeTaskCreationModal,
    handleTaskCreationBackgroundClick,
    handleConfirmTaskCreationClose,
    handleCancelTaskCreationClose,
    openReviewFlowModal,
    closeReviewFlowModal,
    isReviewResultModalOpen,
    selectedResultReviewCardId,
    openReviewResultModal,
    closeReviewResultModal,
    handleReviewCardDeleteSuccess,
    isExamSheetModalOpen,
    openExamSheetModal,
    closeExamSheetModal,
    handleSaveCategory,
    toggleSidebar,
  };
};