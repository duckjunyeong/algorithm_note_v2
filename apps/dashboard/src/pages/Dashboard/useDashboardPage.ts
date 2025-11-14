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
  const [isReviewMenuOpen, setIsReviewMenuOpen] = useState<boolean>(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState<boolean>(false);
  const [isTaskCreationConfirmOpen, setIsTaskCreationConfirmOpen] = useState<boolean>(false);
  const [isTaskReviewAiChooserOpen, setIsTaskReviewAiChooserOpen] = useState<boolean>(false);
  const [selectedReviewCardId, setSelectedReviewCardId] = useState<number | null>(null);
  const [isReviewResultModalOpen, setIsReviewResultModalOpen] = useState<boolean>(false);
  const [isReviewTestChatModalOpen, setIsReviewTestChatModalOpen] = useState<boolean>(false);
  const [reviewTestTutorLevel, setReviewTestTutorLevel] = useState<string | null>(null);
  const [selectedResultReviewCardId, setSelectedResultReviewCardId] = useState<number | null>(null);
  const [isExamSheetModalOpen, setIsExamSheetModalOpen] = useState<boolean>(false);

  const [selectedTaskType, setSelectedTaskType] = useState<'concept' | 'memorization' | 'approach'>('concept');
  const [taskField, setTaskField] = useState<string>('');

  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [isChatCloseConfirmOpen, setIsChatCloseConfirmOpen] = useState<boolean>(false);

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

  const handleRetryFetch = async () => {
    await Promise.all([
      fetchReviewCards(),
      loadCategories()
    ]);
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

  const openReviewMenu = () => setIsReviewMenuOpen(true);
  const closeReviewMenu = () => {
    setIsReviewMenuOpen(false);
    if (reviewCardsError) {
      clearError();
    }
  };

  const openTaskCreationModal = () => setIsTaskCreationModalOpen(true);
  const closeTaskCreationModal = () => {
    setIsTaskCreationModalOpen(false);
    if (reviewCardsError) {
      clearError();
    }
  };

  const handleConfirmTask = () => {
    console.log('Task confirmed:', {
      taskType: selectedTaskType,
      field: taskField,
    });
    closeReviewMenu();
    openChatModal();
  };

  const handleTaskFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskField(e.target.value);
  };

  const openChatModal = () => setIsChatModalOpen(true);
  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedTaskType('concept');
    setTaskField('');
  };

  const handleChatBackgroundClick = () => {
    setIsChatCloseConfirmOpen(true);
  };

  const handleConfirmChatClose = () => {
    setIsChatCloseConfirmOpen(false);
    closeChatModal();
  };

  const handleCancelChatClose = () => {
    setIsChatCloseConfirmOpen(false);
  };

  // ChatModal에서 질문 생성 완료 시 TaskCreationModal 열기
  const handleChatQuestionsGenerated = () => {
    closeChatModal();           // ChatModal 닫기
    openTaskCreationModal();    // TaskCreationModal 열기
  };

  const handleTaskCreationBackgroundClick = () => {
    setIsTaskCreationConfirmOpen(true);
  };

  const handleConfirmTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
    closeReviewMenu();
    closeTaskCreationModal();
  };

  const handleCancelTaskCreationClose = () => {
    setIsTaskCreationConfirmOpen(false);
  };

  const openTaskReviewAiChooser = (reviewCardId: number) => {
    const reviewCard = backlogCards.find(card => card.reviewCardId === reviewCardId) ||
                      completedCards.find(card => card.reviewCardId === reviewCardId);

    if (reviewCard?.taskType !== 'concept') {
      setSelectedReviewCardId(reviewCardId);
      setReviewTestTutorLevel('normal');
      setIsReviewTestChatModalOpen(true);
    } else {
      setSelectedReviewCardId(reviewCardId);
      setIsTaskReviewAiChooserOpen(true);
    }
  };

  const closeTaskReviewAiChooser = () => {
    setIsTaskReviewAiChooserOpen(false);
    setSelectedReviewCardId(null);
  };

  const closeReviewTestChatModal = () => {
    setIsReviewTestChatModalOpen(false);
    setSelectedReviewCardId(null);
    setReviewTestTutorLevel(null);
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

  const handleCreateTask = async (data: {
    taskType: 'concept' | 'approach' | 'memorization';
    questions: Array<{ id: number; text: string; isSelected: boolean; groupId: string | null }>;
    groups: Array<{ id: string; name: string; questionIds: number[] }>;
    settings: {
      repetitionCycle: number;
      importance: number;
      category: string;
    };
  }) => {
    try {
      console.log('Creating task with data:', data);

      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccessToast('태스크가 성공적으로 생성되었습니다.');
      closeTaskCreationModal();

      await fetchReviewCards();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '태스크 생성에 실패했습니다.';
      showErrorToast(errorMsg);
      throw error;
    }
  };

  return {
    isSidebarOpen,
    selectedTask,
    isConfirmModalOpen,
    isConfirmLoading,
    isReviewMenuOpen,
    isTaskCreationModalOpen,
    isTaskCreationConfirmOpen,
    isTaskReviewAiChooserOpen,
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
    openReviewMenu,
    closeReviewMenu,
    closeTaskCreationModal,
    handleTaskCreationBackgroundClick,
    handleConfirmTaskCreationClose,
    handleCancelTaskCreationClose,
    openTaskReviewAiChooser,
    closeTaskReviewAiChooser,
    isReviewResultModalOpen,
    selectedResultReviewCardId,
    openReviewResultModal,
    closeReviewResultModal,
    handleReviewCardDeleteSuccess,
    isExamSheetModalOpen,
    openExamSheetModal,
    closeExamSheetModal,
    handleSaveCategory,
    handleCreateTask,
    toggleSidebar,
    selectedTaskType,
    setSelectedTaskType,
    taskField,
    handleTaskFieldChange,
    handleConfirmTask,
    isChatModalOpen,
    closeChatModal,
    handleChatQuestionsGenerated,
    isChatCloseConfirmOpen,
    handleChatBackgroundClick,
    handleConfirmChatClose,
    handleCancelChatClose,
    handleRetryFetch,
    isReviewTestChatModalOpen,
    closeReviewTestChatModal,
    reviewTestTutorLevel,
  };
};