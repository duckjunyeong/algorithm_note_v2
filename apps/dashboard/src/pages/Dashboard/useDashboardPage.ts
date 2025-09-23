// DashboardPage/useDashboardPage.ts
import { useState, useMemo } from 'react';

export type TaskStatus = 'backlog' | 'failed' | 'done';
export interface Task { id: string; type: string; title: string; description: string; status: TaskStatus; }

export const useDashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmStop = () => {
    closeConfirmModal();
    closeRegisterModal();
  };

  const allTasks: Task[] = [
    { id: 'T-001', type: '서브태스크', title: '[frontend] Clerk 기반 소셜 로그인/회원가입 기능 구현', description: '...', status: 'done' },
    { id: 'T-002', type: '서브태스크', title: '[backend] 문제 등록 및 AI 분석 파이프라인 구축', description: '...', status: 'backlog' },
    { id: 'T-003', type: '주요태스크', title: '[infra] CI/CD 파이프라인 개선', description: '...', status: 'backlog' },
    { id: 'T-004', type: '서브태스크', title: '[frontend] 회원 프로필 페이지 UI 개발', description: '...', status: 'backlog' },
    { id: 'T-005', type: '버그수정', title: '[backend] 로그인 시 간헐적 500 에러 수정', description: '...', status: 'failed' },
    { id: 'T-006', type: '주요태스크', title: '[DB] 데이터베이스 스키마 최적화', description: '...', status: 'done' },
    { id: 'T-007', type: '버그수정', title: '[frontend] 모바일에서 UI 깨짐 현상 수정', description: '...', status: 'failed' },
  ];
  const tasksByStatus = useMemo(() => {
    return allTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [allTasks]);
  const progressStats = useMemo(() => {
    const totalCount = allTasks.length;
    const doneCount = tasksByStatus.done?.length || 0;
    const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const chartData = [{ name: 'Done', value: percentage, fill: '#5E6AD2' }];
    return { totalCount, doneCount, percentage, chartData };
  }, [allTasks, tasksByStatus]);
  const analysisStats = useMemo(() => {
    const doneCount = tasksByStatus.done?.length || 0;
    const failCount = tasksByStatus.failed?.length || 0;
    const completedCount = doneCount + failCount;
    const successRate = completedCount > 0 ? Math.round((doneCount / completedCount) * 100) : 0;
    const barChartData = [
      { name: '실패', value: failCount, fill: '#6B7280' },
      { name: '완료', value: doneCount, fill: '#5E6AD2' },
    ];
    const pieChartData = [
      { name: '완료', value: doneCount },
      { name: '실패', value: failCount },
    ];
    const today = new Date();
    const growthData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const rate = (6 - i) > 0 
        ? Math.floor(Math.random() * (75 - 40 + 1) + 40)
        : successRate;
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        rate: rate,
      };
    });
    return { successRate, barChartData, pieChartData, growthData, doneCount, failCount };
  }, [tasksByStatus]);
  
  return {
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
    toggleSidebar,
  };
};