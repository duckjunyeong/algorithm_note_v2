import { SidebarNav } from '../../components/SidebarNav';
import { Header } from '../../components/Header';
import TaskCard from '../Dashboard/components/TaskCard'
import { FiPlus, FiGrid, FiList, FiTrendingUp } from 'react-icons/fi';
import type { Task } from './useDashboardPage';

export interface DashboardPageViewProps {
  isSidebarOpen: boolean;
  tasks: Task[];
  onToggleSidebar: () => void;
}

export const DashboardPageView = ({
  isSidebarOpen,
  tasks,
  onToggleSidebar,
} : DashboardPageViewProps) => {
  return (
    <div className="relative min-h-screen bg-background-tertiary">
      <SidebarNav isOpen={isSidebarOpen} />

      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={onToggleSidebar} />

        <main className="p-8 pt-24">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">알고리바 태스크 목록</h1>
              <p className="mt-1 text-text-secondary">태스크 진행 상황을 한눈에 확인하세요</p>
            </div>
            <button className="flex items-center gap-2 rounded-md bg-brand p-2 px-4 text-sm font-semibold text-text-inverse transition-colors hover:bg-brand-dark">
              <FiPlus />
              추가 태스크 생성
            </button>
          </div>

          {/* 통계 섹션 */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
             <div className="rounded-lg bg-background-secondary p-4">
              <FiGrid className="text-brand" size={24}/>
              <p className="mt-4 text-2xl font-bold text-text-primary">2</p>
              <p className="text-sm text-text-secondary">전체 태스크</p>
            </div>
             <div className="rounded-lg bg-background-secondary p-4">
              <FiList className="text-brand" size={24}/>
              <p className="mt-4 text-2xl font-bold text-text-primary">1</p>
              <p className="text-sm text-text-secondary">진행 중</p>
            </div>
             <div className="rounded-lg bg-background-secondary p-4">
              <FiTrendingUp className="text-semantic-success" size={24}/>
              <p className="mt-4 text-2xl font-bold text-text-primary">0%</p>
              <p className="text-sm text-text-secondary">완료됨</p>
            </div>
          </div>

          {/* 태스크 카드 그리드 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text-primary">진행중 (1)</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  type={task.type}
                  title={task.title}
                  description={task.description}
                  tags={[
                    { label: 'Type', value: task.type },
                    { label: 'Status', value: 'In Progress', backgroundColor: 'bg-blue-50', textColor: 'text-blue-600' }
                  ]}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};