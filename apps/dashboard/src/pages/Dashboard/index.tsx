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
    toggleSidebar 
  } = useDashboardPage();

  return (
    <DashboardPageView
      isSidebarOpen={isSidebarOpen}
      tasksByStatus={tasksByStatus}
      progressStats={progressStats}
      analysisStats={analysisStats}
      onToggleSidebar={toggleSidebar}
    />
  );
};

export default DashboardPage;