// DashboardPage/index.tsx
import type { FC } from 'react';
import { useDashboardPage } from './useDashboardPage';
import { DashboardPageView } from './DashboardPage.view';

const DashboardPage: FC = () => {
  // 훅을 호출하여 상태와 로직을 가져옵니다.
  const { isSidebarOpen, tasks, toggleSidebar } = useDashboardPage();

  // 뷰 컴포넌트에 필요한 props를 전달하여 렌더링합니다.
  return (
    <DashboardPageView
      isSidebarOpen={isSidebarOpen}
      tasks={tasks}
      onToggleSidebar={toggleSidebar}
    />
  );
};

export default DashboardPage;