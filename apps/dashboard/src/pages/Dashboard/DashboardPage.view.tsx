// DashboardPage/DashboardPage.view.tsx
import type { FC } from 'react';
import { 
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Area
} from 'recharts';
// 🔥 수정: 제공해주신 import 경로로 변경
import { SidebarNav } from '../../components/SidebarNav';
import { Header } from '../../components/Header';
import TaskCard from '../Dashboard/components/TaskCard';
import { FiPlus, FiArrowDown } from 'react-icons/fi';
import type { Task, TaskStatus } from './useDashboardPage';
import RegisterProblemModal from '../Dashboard/components/RegisterProblemModal';
import ConfirmModal from '../../../../../libs/ui-components/src/components/ConfirmModal';

export interface DashboardPageViewProps {
  isSidebarOpen: boolean;
  tasksByStatus: Record<TaskStatus, Task[]>;
  progressStats: {
    totalCount: number;
    doneCount: number;
    percentage: number;
    chartData: { name: string; value: number; fill: string }[];
  };
  analysisStats: {
    successRate: number;
    barChartData: { name: string; value: number; fill: string }[];
    pieChartData: { name: string; value: number }[];
    growthData: { date: string; rate: number }[];
    doneCount: number;
    failCount: number;
  };
  onToggleSidebar: () => void;
  isRegisterModalOpen: boolean;
  isConfirmModalOpen: boolean;
  onOpenRegisterModal: () => void;
  onOpenConfirmModal: () => void;
  onCloseConfirmModal: () => void;
  onConfirmStop: () => void;
}

const columnStyles: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  backlog: { bg: 'bg-neutral-800', text: 'text-text-inverse', dot: 'bg-neutral-400' },
  failed: { bg: 'bg-brand', text: 'text-text-inverse', dot: 'bg-brand-light' },
  done: { bg: 'bg-semantic-success', text: 'text-text-inverse', dot: 'bg-green-300' },
};

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-neutral-900 p-2 px-3 text-sm text-neutral-50 shadow-lg">
        <span className="font-semibold">{`${label} 성공률: ${payload[0].value}%`}</span>
      </div>
    );
  }
  return null;
};

export const DashboardPageView: FC<DashboardPageViewProps> = ({
  isSidebarOpen,
  tasksByStatus,
  progressStats,
  analysisStats,
  onToggleSidebar,
  isRegisterModalOpen,
  isConfirmModalOpen,
  onOpenRegisterModal,
  onOpenConfirmModal,
  onCloseConfirmModal,
  onConfirmStop,
}) => {
  const PIE_COLORS = ['#5E6AD2', '#D1D5DB'];

  return (
    <div className="relative min-h-screen bg-background-tertiary">
      <SidebarNav isOpen={isSidebarOpen} />
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header onToggleSidebar={onToggleSidebar} />
        <main className="p-8 pt-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">알고리바 태스크 목록</h1>
              <p className="mt-1 text-text-secondary">태스크 진행 상황을 한눈에 확인하세요</p>
            </div>
            <button 
              onClick={onOpenRegisterModal}
              className="flex items-center gap-2 rounded-md bg-brand p-2 px-4 text-sm font-semibold text-text-inverse transition-colors hover:bg-brand-dark"
            >
              <FiPlus /> 추가 태스크 생성
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="flex w-full flex-col justify-between rounded-lg bg-background-secondary p-4 lg:w-1/3">
              <h2 className="text-base font-semibold text-text-primary">전체 진행률</h2>
              <div className="relative mx-auto h-24 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={progressStats.chartData} startAngle={180} endAngle={0} barSize={8}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} className="fill-brand"/>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-text-primary">{progressStats.percentage}%</span>
                  <span className="mt-1 text-xs text-text-secondary">{progressStats.doneCount} / {progressStats.totalCount}</span>
                </div>
              </div>
            </div>
            
            <div className="flex w-full flex-col gap-4 rounded-lg bg-background-secondary p-4 lg:w-2/3">
              <div className="flex items-center justify-between">
                 <h2 className="text-base font-semibold text-text-primary">주간 성공률</h2>
              </div>
              <div className="h-full flex-grow">
                 <ResponsiveContainer width="100%" height={125}>
                  <LineChart data={analysisStats.growthData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSuccessRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5E6AD2" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#5E6AD2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="transparent" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ stroke: '#9CA3AF', strokeDasharray: '3 3' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="transparent" fill="url(#colorSuccessRate)" />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#5E6AD2"
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {(['backlog', 'failed', 'done'] as TaskStatus[]).map((status) => {
              const tasks = tasksByStatus[status] || [];
              const styles = columnStyles[status];
              const title = { backlog: '백로그', failed: '실패', done: '완료' }[status];
              return (
                <div key={status} className="flex flex-col gap-4">
                  <div className={`flex items-center justify-between rounded-lg px-4 py-2 ${styles.bg} ${styles.text}`}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                      <span className="font-semibold">{title}</span>
                      <span>{tasks.length}</span>
                    </div>
                    <FiArrowDown size={16} />
                  </div>
                  {tasks.map((task) => (
                    <TaskCard key={task.id} {...task} />
                  ))}
                </div>
              );
            })}
          </div>
        </main>
      </div>
      
      <RegisterProblemModal
        isOpen={isRegisterModalOpen}
        onAttemptClose={onOpenConfirmModal}
      />

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        title="정말 중단하시겠습니까?"
        message="등록 과정이 저장되지 않습니다."
        onConfirm={onConfirmStop}
        onCancel={onCloseConfirmModal}
      />
    </div>
  );
};