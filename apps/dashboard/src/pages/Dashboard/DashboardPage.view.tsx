// DashboardPage/DashboardPage.view.tsx
import type { FC } from 'react';
import type { ReviewCard as ReviewCardType } from '../../../../../libs/api-types/src';
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
import { ReviewCard } from '../../../../../libs/ui-components/src/components/ReviewCard';
import { ReviewTestModal } from './components/ReviewTestModal';
import { ReviewResultModal } from './components/ReviewResultModal';


export interface DashboardPageViewProps {
  isSidebarOpen: boolean;

  // 복습 카드 관련 props
  backlogCards: ReviewCardType[];
  completedCards: ReviewCardType[];
  reviewCardsLoading: boolean;
  reviewCardsError: string | null;
  selectedReviewCard: ReviewCardType | null;
  // Category 관련 props
  categories: Array<{ categoryId: number; name: string; color: string }>;
  isLoadingCategories: boolean;
  categoryError: string | null;
  // 백로그 필터/정렬 관련 props
  backlogFilterCategoryId: number | null;
  backlogSortBy: 'successRate' | 'importance';
  onBacklogFilterCategoryChange: (categoryId: number | null) => void;
  onBacklogSortChange: (sortBy: 'successRate' | 'importance') => void;
  // 완료 필터/정렬 관련 props
  completedFilterCategoryId: number | null;
  completedSortBy: 'successRate' | 'importance';
  onCompletedFilterCategoryChange: (categoryId: number | null) => void;
  onCompletedSortChange: (sortBy: 'successRate' | 'importance') => void;
  onToggleSidebar: () => void;
  selectedTask: Task | null;
  isConfirmModalOpen: boolean;
  isConfirmLoading: boolean;
  isTaskCreationModalOpen: boolean;
  isTaskCreationConfirmOpen: boolean;
  isReviewTestModalOpen: boolean;
  selectedReviewCardId: number | null;
  onOpenConfirmModal: () => void;
  isReviewResultModalOpen: boolean;
  selectedResultReviewCardId: number | null;
  onOpenReviewResultModal: (reviewCardId: number) => void;
  onCloseReviewResultModal: () => void;
  onCloseConfirmModal: () => void;
  onOpenTaskCreationModal: () => void;
  onCloseTaskCreationModal: () => void;
  onTaskCreationBackgroundClick: () => void;
  onConfirmTaskCreationClose: () => void;
  onCancelTaskCreationClose: () => void;
  onOpenReviewTestModal: (reviewCardId: number) => void;
  onCloseReviewTestModal: () => void;
  onSaveCategory: (name: string, color: string) => Promise<void>;
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
  backlogCards,
  completedCards,
  reviewCardsLoading,
  reviewCardsError,
  selectedReviewCard,
  categories,
  isLoadingCategories,
  categoryError,
  backlogFilterCategoryId,
  backlogSortBy,
  onBacklogFilterCategoryChange,
  onBacklogSortChange,
  completedFilterCategoryId,
  completedSortBy,
  onCompletedFilterCategoryChange,
  onCompletedSortChange,
  onToggleSidebar,
  isTaskCreationModalOpen,
  isTaskCreationConfirmOpen,
  isReviewResultModalOpen,
  isReviewTestModalOpen,
  selectedReviewCardId,
  selectedResultReviewCardId,
  onOpenReviewResultModal,
  onCloseReviewResultModal,
  onOpenTaskCreationModal,
  onCloseTaskCreationModal,
  onTaskCreationBackgroundClick,
  onConfirmTaskCreationClose,
  onCancelTaskCreationClose,
  onOpenReviewTestModal,
  onCloseReviewTestModal,
  onSaveCategory,
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
              <h1 className="text-2xl font-bold text-text-primary">태스크 목록</h1>
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
             
            </div>
            
            <div className="flex w-full flex-col gap-4 rounded-lg bg-background-secondary p-4 lg:w-2/3">
              <div className="flex items-center justify-between">
                 <h2 className="text-base font-semibold text-text-primary">주간 성공률</h2>
              </div>
              <div className="h-full flex-grow">
           
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
                <div className="flex items-center gap-2">
                  <select
                    value={backlogFilterCategoryId ?? ''}
                    onChange={(e) => onBacklogFilterCategoryChange(e.target.value ? Number(e.target.value) : null)}
                    className="bg-neutral-700 text-white text-sm rounded px-2 py-1 border-none outline-none"
                  >
                    <option value="">전체 카테고리</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={backlogSortBy}
                    onChange={(e) => onBacklogSortChange(e.target.value as 'successRate' | 'importance')}
                    className="bg-neutral-700 text-white text-sm rounded px-2 py-1 border-none outline-none"
                  >
                    <option value="successRate">정답률 낮은 순</option>
                    <option value="importance">중요도 높은 순</option>
                  </select>
                </div>
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
                  <ReviewCard
                    key={card.reviewCardId}
                    id={`R-${card.reviewCardId}`}
                    category={card.category}
                    title={card.title}
                    tags={[
                      { label: '정답률', value: `${card.successRate?.toFixed(1) ?? 0}%` },
                      { label: '중요도', value: `${card.importance}/5` },
                      { label: '주기', value: `${card.reviewCycle}일` },
                      { label: '반복', value: `${card.reviewCount}회` },
                    ]}
                    onTestStart={() => onOpenReviewTestModal(card.reviewCardId)}
                  />
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
                <div className="flex items-center gap-2">
                  <select
                    value={completedFilterCategoryId ?? ''}
                    onChange={(e) => onCompletedFilterCategoryChange(e.target.value ? Number(e.target.value) : null)}
                    className="bg-brand-dark text-white text-sm rounded px-2 py-1 border-none outline-none"
                  >
                    <option value="">전체 카테고리</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={completedSortBy}
                    onChange={(e) => onCompletedSortChange(e.target.value as 'successRate' | 'importance')}
                    className="bg-brand-dark text-white text-sm rounded px-2 py-1 border-none outline-none"
                  >
                    <option value="successRate">정답률 높은 순</option>
                    <option value="importance">중요도 높은 순</option>
                  </select>
                </div>
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
                  <ReviewCard
                    key={card.reviewCardId}
                    id={`R-${card.reviewCardId}`}
                    category={card.category}
                    title={card.title}
                    isActive={card.isActive}
                    tags={[
                      { label: '정답률', value: `${card.successRate?.toFixed(1) ?? 0}%` },
                      { label: '중요도', value: `${card.importance}/5` },
                      { label: '주기', value: `${card.reviewCycle}일` },
                      { label: '반복', value: `${card.reviewCount}회` },
                    ]}
                    onResultView={() => onOpenReviewResultModal(card.reviewCardId)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={isTaskCreationConfirmOpen}
        title="작성을 취소하시겠습니까?"
        message="작성 중인 내용이 사라집니다."
        onConfirm={onConfirmTaskCreationClose}
        onCancel={onCancelTaskCreationClose}
        isLoading={false}
        confirmText="확인"
        cancelText="취소"
      />

      <TaskCreationModal
        isOpen={isTaskCreationModalOpen}
        onClose={onCloseTaskCreationModal}
        onBackgroundClick={onTaskCreationBackgroundClick}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        categoryError={categoryError}
        onSaveCategory={onSaveCategory}
      />

      <ReviewTestModal
        isOpen={isReviewTestModalOpen}
        reviewCardId={selectedReviewCardId}
        reviewCard={selectedReviewCard}
        onClose={onCloseReviewTestModal}
      />

      <ReviewResultModal
        isOpen={isReviewResultModalOpen}
        reviewCardId={selectedResultReviewCardId}
        onClose={onCloseReviewResultModal}
      />
    </div>
  );
};