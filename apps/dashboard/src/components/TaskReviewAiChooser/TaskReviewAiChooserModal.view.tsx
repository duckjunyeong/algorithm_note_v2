import { Brain, GraduationCap, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AiMode } from './useTaskReviewAiChooserModal';
import { ChatModal } from '../ChatModal';
import { TaskResultModal } from '../TaskResultModal';

interface TaskReviewAiChooserViewProps {
  isOpen: boolean;
  selectedAiMode: AiMode | null;
  selectedTutorLevel: string | null;
  reviewCardId: number | null;
  reviewCard: any | null;
  showChatModal: boolean;
  showResultModal: boolean;
  onAiModeSelect: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
  onChatModalClose: () => void;
  onReviewTestNext: () => void;
  onTaskResultClose: () => void;
}

const AI_MODE_OPTIONS = [
  {
    id: 'beginner-tutor' as const,
    title: '입문 튜터',
    description: '생성된 질문들과 관련된 분야에 대해서 무지한 AI Model입니다.',
    icon: <Brain size={24} />,
    iconBgClass: 'bg-green-100 text-green-600',
  },
  {
    id: 'advanced-tutor' as const,
    title: '학부생 튜터',
    description: '관련된 분야에 대해서 학부생 수준 AI Model입니다.',
    icon: <GraduationCap size={24} />,
    iconBgClass: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'prof-tutor' as const,
    title: '교수 튜터',
    description: '생성된 질문들과 관련된 분야에 대해서 교수 수준 AI Model입니다.',
    icon: <Award size={24} />,
    iconBgClass: 'bg-purple-100 text-purple-600',
  },
];

export function TaskReviewAiChooserView({
  isOpen,
  selectedAiMode,
  selectedTutorLevel,
  reviewCardId,
  reviewCard,
  showChatModal,
  showResultModal,
  onAiModeSelect,
  onCancel,
  onNext,
  onChatModalClose,
  onReviewTestNext,
  onTaskResultClose,
}: TaskReviewAiChooserViewProps) {
  console.log('[TaskReviewAiChooserView] Render:', {
    isOpen,
    showChatModal,
    showResultModal,
    reviewCardId,
    reviewCard,
  });

  if (!isOpen) {
    console.log('[TaskReviewAiChooserView] Not rendering - isOpen is false');
    return null;
  }

  if (showChatModal) {
    console.log('[TaskReviewAiChooserView] Rendering ChatModal');
    return (
      <ChatModal
        isOpen={true}
        onClose={onChatModalClose}
        mode="review-test"
        tutorLevel={selectedTutorLevel || 'beginner'}
        reviewCardId={reviewCardId || 0}
        taskType={reviewCard?.taskType || 'concept'}
        taskField={reviewCard?.taskField || ''}
        title={`${reviewCard?.title || '복습'} - AI 튜터 테스트`}
        onNext={onReviewTestNext}
      />
    );
  }

  if (showResultModal && reviewCardId) {
    console.log('[TaskReviewAiChooserView] Rendering TaskResultModal');
    return (
      <TaskResultModal
        isOpen={true}
        onClose={onTaskResultClose}
        reviewCardId={reviewCardId}
      />
    );
  }

  console.log('[TaskReviewAiChooserView] Rendering AI Mode Selection Dialog');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="absolute inset-0" onClick={onCancel} />
      <AnimatePresence mode="wait">
        <motion.div
          key="ai-selection"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <div className="bg-background-secondary rounded-xl shadow-lg p-6 sm:p-8 max-w-lg w-full font-sans">
            <header className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  AI 모드 선택
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  테스트에 사용할 AI 모드를 선택해주세요.
                </p>
              </div>
            </header>

            <div className="space-y-3 mb-4">
              {AI_MODE_OPTIONS.map((aiMode) => {
                const isSelected = selectedAiMode === aiMode.id;

                const itemClasses = [
                  'flex', 'items-center', 'space-x-4', 'p-4', 'rounded-lg',
                  'cursor-pointer', 'transition-all', 'duration-200', 'relative',
                  isSelected
                    ? 'border-2 border-brand-DEFAULT bg-brand-100 shadow-md'
                    : 'border-2 border-transparent bg-neutral-50 hover:border-brand-200 hover:bg-neutral-100'
                ].join(' ');

                return (
                  <div
                    key={aiMode.id}
                    className={itemClasses}
                    onClick={() => onAiModeSelect(aiMode.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onAiModeSelect(aiMode.id);
                      }
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${aiMode.iconBgClass}`}
                    >
                      {aiMode.icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary">
                        {aiMode.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {aiMode.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-DEFAULT flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-8 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-text-secondary text-center">
                AI Model의 수준이 높아지면 꼬리질문을 덜 하게 됩니다.
              </p>
            </div>

            <footer className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-md bg-neutral-50 text-text-primary font-medium text-sm hover:bg-neutral-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                disabled={!selectedAiMode}
                className="px-5 py-2.5 rounded-md bg-neutral-black text-text-inverse font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </footer>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
