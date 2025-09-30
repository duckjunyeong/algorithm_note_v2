// DashboardPage/DashboardPage.view.tsx
import type { FC } from 'react';
import type { ReviewCard } from '../../../../../libs/api-types/src';
import { 
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Area
} from 'recharts';
// 🔥 수정: 제공해주신 import 경로로 변경
import { SidebarNav } from '../../components/SidebarNav';
import { Header } from '../../components/Header';
import { FiArrowDown, FiPlus } from 'react-icons/fi';
import type { Task, TaskStatus } from './useDashboardPage';
import ConfirmModal from '../../../../../libs/ui-components/src/components/ConfirmModal';
import { TaskCreationModal } from './components/TaskCreationModal';

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
  // 복습 카드 관련 props
  backlogCards: ReviewCard[];
  completedCards: ReviewCard[];
  reviewCardsLoading: boolean;
  reviewCardsError: string | null;
  onToggleSidebar: () => void;
  isChatModalOpen: boolean;
  selectedTask: Task | null;
  chatSessionKey: string;
  isConfirmModalOpen: boolean;
  isConfirmLoading: boolean;
  isTaskCreationModalOpen: boolean;
  onOpenChatModal: () => void;
  onCloseChatModal: () => void;
  onOpenConfirmModal: () => void;
  onCloseConfirmModal: () => void;
  onOpenTaskCreationModal: () => void;
  onCloseTaskCreationModal: () => void;
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

// 복습 카드 컴포넌트
const ReviewCardComponent: FC<{ card: ReviewCard }> = ({ card }) => {
  return (
    <div className="rounded-lg border border-border-primary bg-background-primary p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-text-primary line-clamp-2">{card.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
            <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
              {card.category}
            </span>
            <span>중요도: {card.importance}/5</span>
            <span>{card.reviewCycle}일 주기</span>
          </div>
          <div className="mt-2 text-xs text-text-tertiary">
            반복 횟수: {card.reviewCount}회
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPageView: FC<DashboardPageViewProps> = ({
  isSidebarOpen,
  tasksByStatus,
  progressStats,
  analysisStats,
  backlogCards,
  completedCards,
  reviewCardsLoading,
  reviewCardsError,
  onToggleSidebar,
  isChatModalOpen,
  selectedTask,
  chatSessionKey,
  isConfirmModalOpen,
  isConfirmLoading,
  isTaskCreationModalOpen,
  onOpenChatModal,
  onCloseChatModal,
  onOpenConfirmModal,
  onCloseConfirmModal,
  onOpenTaskCreationModal,
  onCloseTaskCreationModal,
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
              onClick={onOpenTaskCreationModal}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <FiPlus size={16} />
              추가 태스크 생성
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
          
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 백로그 복습 카드 컬럼 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg px-4 py-2 bg-neutral-800 text-text-inverse">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-neutral-400" />
                  <span className="font-semibold">백로그</span>
                  <span>{backlogCards.length}</span>
                </div>
                <FiArrowDown size={16} />
              </div>
              {reviewCardsLoading ? (
                <div className="text-center py-8 text-text-secondary">
                  복습 카드를 불러오는 중...
                </div>
              ) : reviewCardsError ? (
                <div className="text-center py-8 text-red-500">
                  {reviewCardsError}
                </div>
              ) : backlogCards.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  백로그에 복습 카드가 없습니다.
                </div>
              ) : (
                backlogCards.map((card) => (
                  <ReviewCardComponent key={card.reviewCardId} card={card} />
                ))
              )}
            </div>

            {/* 완료 복습 카드 컬럼 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg px-4 py-2 bg-brand text-text-inverse">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-light" />
                  <span className="font-semibold">완료</span>
                  <span>{completedCards.length}</span>
                </div>
                <FiArrowDown size={16} />
              </div>
              {reviewCardsLoading ? (
                <div className="text-center py-8 text-text-secondary">
                  복습 카드를 불러오는 중...
                </div>
              ) : reviewCardsError ? (
                <div className="text-center py-8 text-red-500">
                  {reviewCardsError}
                </div>
              ) : completedCards.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  완료된 복습 카드가 없습니다.
                </div>
              ) : (
                completedCards.map((card) => (
                  <ReviewCardComponent key={card.reviewCardId} card={card} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="작업을 중단하시겠습니까?"
        message="진행 중인 채팅이 취소되고 입력한 내용이 사라집니다."
        onConfirm={onConfirmStop}
        onCancel={onCloseConfirmModal}
        isLoading={isConfirmLoading}
        confirmText="중단하기"
        cancelText="취소"
      />

      <TaskCreationModal
        isOpen={isTaskCreationModalOpen}
        onClose={onCloseTaskCreationModal}
      />
    </div>
  );
};