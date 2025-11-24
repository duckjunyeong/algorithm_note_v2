import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiChevronLeft } from 'react-icons/fi';
import type { ReviewFlowView } from './useReviewFlowModal';
import type { AiMode } from '../../../../components/TaskReviewAiChooser/useTaskReviewAiChooserModal';
import { TaskReviewAiChooserModal } from '../../../../components/TaskReviewAiChooser';
import { TestView } from './views/TestView';
import { ChatModal } from '../../../../components/ChatModal';

export interface ReviewFlowModalViewProps {
  isOpen: boolean;
  currentView: ReviewFlowView;
  selectedAiMode: AiMode | null;
  selectedTutorLevel: string | null;
  reviewCardId: number | null;
  reviewCard: any | null;
  onBackToAiSelection: () => void;
  onClose: () => void;
}

export function ReviewFlowModalView({
  isOpen,
  currentView,
  selectedAiMode,
  selectedTutorLevel,
  reviewCardId,
  reviewCard,
  onBackToAiSelection,
  onClose,
}: ReviewFlowModalViewProps) {
  if (!isOpen) return null;

  if (currentView === 'chat-test') {
    return (
      <ChatModal
        isOpen={true}
        onClose={onClose}
        mode="review-test"
        tutorLevel={selectedTutorLevel || 'beginner'}
        reviewCardId={reviewCardId || 0}
        taskType={reviewCard?.taskType || 'concept'}
        taskField={reviewCard?.taskField || ''}
        title={`${reviewCard?.title || '복습'} - AI 튜터 테스트`}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="absolute inset-0" onClick={onClose} />
      <AnimatePresence mode="wait">
        {currentView === 'ai-selection' ? (
          <motion.div
            key="ai-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <TaskReviewAiChooserModal
              isOpen={true}
              reviewCardId={reviewCardId}
              reviewCard={reviewCard}
              onClose={onClose}
            />
          </motion.div>
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative bg-background-secondary rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBackToAiSelection}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="뒤로가기"
                >
                  <FiChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-semibold text-text-primary">
                  복습 테스트
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="닫기"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto">
                <TestView
                  reviewCardId={reviewCardId}
                  reviewCard={reviewCard}
                  selectedAiMode={selectedAiMode}
                  onClose={onClose}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}