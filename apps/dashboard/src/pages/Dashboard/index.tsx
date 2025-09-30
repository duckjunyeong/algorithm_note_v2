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
    openChatModal,
    closeChatModal,
    openConfirmModal,
    closeConfirmModal,
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
      onOpenChatModal={openChatModal}
      onCloseChatModal={closeChatModal}
      onOpenConfirmModal={openConfirmModal}
      onCloseConfirmModal={closeConfirmModal}
      onConfirmStop={handleConfirmStop}
    />
  );
};

export default DashboardPage;