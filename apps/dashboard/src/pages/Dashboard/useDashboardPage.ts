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
  const [isReviewTestModalOpen, setIsReviewTestModalOpen] = useState<boolean>(false);
  const [selectedReviewCardId, setSelectedReviewCardId] = useState<number | null>(null);
  const [isReviewResultModalOpen, setIsReviewResultModalOpen] = useState<boolean>(false);
  const [selectedResultReviewCardId, setSelectedResultReviewCardId] = useState<number | null>(null);

  // Category 관련 상태
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // 필터/정렬 관련 상태 (백로그/완료 분리)
  const [backlogFilterCategoryId, setBacklogFilterCategoryId] = useState<number | null>(null);
  const [backlogSortBy, setBacklogSortBy] = useState<'successRate' | 'importance'>('successRate');

  const [completedFilterCategoryId, setCompletedFilterCategoryId] = useState<number | null>(null);
  const [completedSortBy, setCompletedSortBy] = useState<'successRate' | 'importance'>('successRate');

  // 복습 카드 store 
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

  // 필터링 및 정렬이 적용된 백로그 카드
  const filteredBacklogCards = useMemo(() => {
    let result = filterByCategory(backlogCards, backlogFilterCategoryId);

    result = backlogSortBy === 'successRate'
      ? sortBySuccessRate(result, 'asc')  // 정답률 낮은 순 (복습 필요한 것부터)
      : sortByImportance(result, 'desc'); // 중요도 높은 순

    return result;
  }, [backlogCards, backlogFilterCategoryId, backlogSortBy]);

  // 필터링 및 정렬이 적용된 완료 카드
  const filteredCompletedCards = useMemo(() => {
    let result = filterByCategory(completedCards, completedFilterCategoryId);

    result = completedSortBy === 'successRate'
      ? sortBySuccessRate(result, 'desc')  // 정답률 높은 순 (잘한 것부터)
      : sortByImportance(result, 'desc'); // 중요도 높은 순

    return result;
  }, [completedCards, completedFilterCategoryId, completedSortBy]);

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

  const openReviewResultModal = (reviewCardId: number) => {
    setSelectedResultReviewCardId(reviewCardId);
    setIsReviewResultModalOpen(true);
    console.log('Opening ReviewResultModal for reviewCardId:', reviewCardId);
  };

  const closeReviewResultModal = () => {
    setIsReviewResultModalOpen(false);
    setSelectedResultReviewCardId(null);
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
    backlogCards: filteredBacklogCards,  // 필터/정렬 적용된 카드 반환
    completedCards: filteredCompletedCards,  // 필터/정렬 적용된 카드 반환
    reviewCardsLoading,
    reviewCardsError,
    // Category 관련 상태 추가
    categories,
    isLoadingCategories,
    categoryError,
    // 백로그 필터/정렬 상태 및 핸들러
    backlogFilterCategoryId,
    backlogSortBy,
    setBacklogFilterCategoryId,
    setBacklogSortBy,
    // 완료 필터/정렬 상태 및 핸들러
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
    openReviewTestModal,
    closeReviewTestModal,
    isReviewResultModalOpen,
    selectedResultReviewCardId,
    openReviewResultModal,
    closeReviewResultModal,
    handleSaveCategory,
    toggleSidebar,
  };
};