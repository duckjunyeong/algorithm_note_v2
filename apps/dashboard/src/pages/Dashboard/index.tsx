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
    isReviewTestModalOpen,
    selectedReviewCardId,
    selectedReviewCard,
    backlogCards,
    completedCards,
    reviewCardsLoading,
    reviewCardsError,
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
    toggleSidebar
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
      isReviewTestModalOpen={isReviewTestModalOpen}
      selectedReviewCardId={selectedReviewCardId}
      selectedReviewCard={selectedReviewCard}
      backlogCards={backlogCards}
      completedCards={completedCards}
      reviewCardsLoading={reviewCardsLoading}
      reviewCardsError={reviewCardsError}
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      onOpenConfirmModal={openConfirmModal}
      onCloseConfirmModal={closeConfirmModal}
      onOpenTaskCreationModal={openTaskCreationModal}
      onCloseTaskCreationModal={closeTaskCreationModal}
      onTaskCreationBackgroundClick={handleTaskCreationBackgroundClick}
      onConfirmTaskCreationClose={handleConfirmTaskCreationClose}
      onCancelTaskCreationClose={handleCancelTaskCreationClose}
      onOpenReviewTestModal={openReviewTestModal}
      onCloseReviewTestModal={closeReviewTestModal}
      onSaveCategory={handleSaveCategory}
    />
  );
};

export default DashboardPage;