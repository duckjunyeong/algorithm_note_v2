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
    isRegisterModalOpen,
    isConfirmModalOpen,
    openRegisterModal,
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
      isRegisterModalOpen={isRegisterModalOpen}
      isConfirmModalOpen={isConfirmModalOpen}
      onOpenRegisterModal={openRegisterModal}
      onOpenConfirmModal={openConfirmModal}
      onCloseConfirmModal={closeConfirmModal}
      onConfirmStop={handleConfirmStop}
      onToggleSidebar={toggleSidebar}
    />
  );
};

export default DashboardPage;