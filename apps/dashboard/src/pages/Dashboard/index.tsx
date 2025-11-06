// DashboardPage/index.tsx
import type { FC } from 'react';
import { useDashboardPage } from './useDashboardPage';
import { DashboardPageView } from './DashboardPage.view';

const DashboardPage: FC = () => {
  const {
    isSidebarOpen,
    selectedTask,
    isConfirmModalOpen,
    isConfirmLoading,
    isTaskCreationModalOpen,
    isTaskCreationConfirmOpen,
    isReviewFlowModalOpen,
    selectedReviewCardId,
    selectedReviewCard,
    isReviewResultModalOpen,
    selectedResultReviewCardId,
    backlogCards,
    completedCards,
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
  } = useDashboardPage();

  return (
    <DashboardPageView
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={toggleSidebar}
      selectedTask={selectedTask}
      isConfirmModalOpen={isConfirmModalOpen}
      isConfirmLoading={isConfirmLoading}
      isTaskCreationModalOpen={isTaskCreationModalOpen}
      isTaskCreationConfirmOpen={isTaskCreationConfirmOpen}
      isReviewFlowModalOpen={isReviewFlowModalOpen}
      selectedReviewCardId={selectedReviewCardId}
      selectedReviewCard={selectedReviewCard}
      backlogCards={backlogCards}
      completedCards={completedCards}
      reviewCardsLoading={reviewCardsLoading}
      reviewCardsError={reviewCardsError}
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      backlogFilterCategoryId={backlogFilterCategoryId}
      backlogSortBy={backlogSortBy}
      onBacklogFilterCategoryChange={setBacklogFilterCategoryId}
      onBacklogSortChange={setBacklogSortBy}
      completedFilterCategoryId={completedFilterCategoryId}
      completedSortBy={completedSortBy}
      onCompletedFilterCategoryChange={setCompletedFilterCategoryId}
      onCompletedSortChange={setCompletedSortBy}
      onOpenConfirmModal={openConfirmModal}
      onCloseConfirmModal={closeConfirmModal}
      onOpenTaskCreationModal={openTaskCreationModal}
      onCloseTaskCreationModal={closeTaskCreationModal}
      onTaskCreationBackgroundClick={handleTaskCreationBackgroundClick}
      onConfirmTaskCreationClose={handleConfirmTaskCreationClose}
      onCancelTaskCreationClose={handleCancelTaskCreationClose}
      onOpenReviewFlowModal={openReviewFlowModal}
      onCloseReviewFlowModal={closeReviewFlowModal}
      isReviewResultModalOpen={isReviewResultModalOpen}
      selectedResultReviewCardId={selectedResultReviewCardId}
      onOpenReviewResultModal={openReviewResultModal}
      onCloseReviewResultModal={closeReviewResultModal}
      onReviewCardDeleteSuccess={handleReviewCardDeleteSuccess}
      isExamSheetModalOpen={isExamSheetModalOpen}
      onOpenExamSheetModal={openExamSheetModal}
      onCloseExamSheetModal={closeExamSheetModal}
      onSaveCategory={handleSaveCategory}
      onCreateTask={handleCreateTask}
      selectedTaskType={selectedTaskType}
      onSelectTaskType={setSelectedTaskType}
      taskField={taskField}
      onTaskFieldChange={handleTaskFieldChange}
      onConfirmTask={handleConfirmTask}
      isChatModalOpen={isChatModalOpen}
      onCloseChatModal={closeChatModal}
    />
  );
};

export default DashboardPage;