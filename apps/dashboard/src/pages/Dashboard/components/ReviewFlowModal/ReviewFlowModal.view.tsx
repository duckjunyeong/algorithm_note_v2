import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiChevronLeft } from 'react-icons/fi';
import type { ReviewFlowView } from './useReviewFlowModal';
import { SelectionView } from './views/SelectionView';
import { TestView } from './views/TestView';

export interface ReviewFlowModalViewProps {
  isOpen: boolean;
  currentView: ReviewFlowView;
  selectedReviewType: string | null;
  reviewCardId: number | null;
  reviewCard: any | null;
  onSelectReviewType: (typeId: string) => void;
  onProceedToTest: () => void;
  onBackToSelection: () => void;
  onClose: () => void;
}

export function ReviewFlowModalView({
  isOpen,
  currentView,
  selectedReviewType,
  reviewCardId,
  reviewCard,
  onSelectReviewType,
  onProceedToTest,
  onBackToSelection,
  onClose,
}: ReviewFlowModalViewProps) {
  if (!isOpen) return null;

  const slideVariants = {
    enterFromRight: {
      x: '100%',
      opacity: 0,
    },
    enterFromLeft: {
      x: '-100%',
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exitToRight: {
      x: '100%',
      opacity: 0,
    },
    exitToLeft: {
      x: '-100%',
      opacity: 0,
    },
  };

  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-background-secondary rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            {currentView === 'test' && (
              <button
                onClick={onBackToSelection}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="뒤로가기"
              >
                <FiChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-xl font-semibold text-text-primary">
              {currentView === 'selection' ? '테스트 방식 선택' : '복습 테스트'}
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

        {/* Content with Animation */}
        <div className="relative flex-1 overflow-hidden min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            {currentView === 'selection' ? (
              <motion.div
                key="selection"
                initial="enterFromLeft"
                animate="center"
                exit="exitToLeft"
                variants={slideVariants}
                transition={transition}
              >
                <div className="h-full overflow-y-auto">
                  <SelectionView
                    selectedReviewType={selectedReviewType}
                    onSelectReviewType={onSelectReviewType}
                    onProceedToTest={onProceedToTest}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="test"
                initial="enterFromRight"
                animate="center"
                exit="exitToRight"
                variants={slideVariants}
                transition={transition}
              >
                <div className="h-full overflow-y-auto">
                  <TestView
                    reviewCardId={reviewCardId}
                    reviewCard={reviewCard}
                    onClose={onClose}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}