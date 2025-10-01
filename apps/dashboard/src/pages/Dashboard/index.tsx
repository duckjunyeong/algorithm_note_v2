// DashboardPage/index.tsx
import type { FC } from 'react';
import { useDashboardPage } from './useDashboardPage';
import { DashboardPageView } from './DashboardPage.view';

const DashboardPage: FC = () => {
  const {
    isSidebarOpen,
    tasksByStatus,
    progressStats,
    analysisStats,
    isChatModalOpen,
    selectedTask,
    chatSessionKey,
    isConfirmModalOpen,
    isConfirmLoading,
    isTaskCreationModalOpen,
    isReviewTestModalOpen,
    selectedReviewCardId,
    backlogCards,
    completedCards,
    reviewCardsLoading,
    reviewCardsError,
    openChatModal,
    closeChatModal,
    openConfirmModal,
    closeConfirmModal,
    openTaskCreationModal,
    closeTaskCreationModal,
    openReviewTestModal,
    closeReviewTestModal,
    handleConfirmStop,
    toggleSidebar
  } = useDashboardPage();

  return (
    <DashboardPageView
      isSidebarOpen={isSidebarOpen}
      tasksByStatus={tasksByStatus}
      progressStats={progressStats}
      analysisStats={analysisStats}
      onToggleSidebar={toggleSidebar}
      isChatModalOpen={isChatModalOpen}
      selectedTask={selectedTask}
      chatSessionKey={chatSessionKey}
      isConfirmModalOpen={isConfirmModalOpen}
      isConfirmLoading={isConfirmLoading}
      isTaskCreationModalOpen={isTaskCreationModalOpen}
      isReviewTestModalOpen={isReviewTestModalOpen}
      selectedReviewCardId={selectedReviewCardId}
      backlogCards={backlogCards}
      completedCards={completedCards}
      reviewCardsLoading={reviewCardsLoading}
      reviewCardsError={reviewCardsError}
      onOpenChatModal={openChatModal}
      onCloseChatModal={closeChatModal}
      onOpenConfirmModal={openConfirmModal}
      onCloseConfirmModal={closeConfirmModal}
      onOpenTaskCreationModal={openTaskCreationModal}
      onCloseTaskCreationModal={closeTaskCreationModal}
      onOpenReviewTestModal={openReviewTestModal}
      onCloseReviewTestModal={closeReviewTestModal}
      onConfirmStop={handleConfirmStop}
    />
  );
};

export default DashboardPage;