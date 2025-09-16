import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ViewType } from '../../store/useIncorrectAnswerNoteStore';

// Import view components (will be created next)
import { ChoiceView } from './views/ChoiceView';
import { URLInputView } from './views/URLInputView';
import { ManualInputView } from './views/ManualInputView';
import { CodeInputView } from './views/CodeInputView';
import { ResultsView } from './views/ResultsView';

interface IncorrectAnswerNoteModalViewProps {
  isModalOpen: boolean;
  currentView: ViewType;
  onClose: () => void;
  onBackdropClick: (e: React.MouseEvent) => void;
  onEscapeKey: (e: React.KeyboardEvent) => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const viewVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

export function IncorrectAnswerNoteModalView({
  isModalOpen,
  currentView,
  onClose,
  onBackdropClick,
  onEscapeKey
}: IncorrectAnswerNoteModalViewProps) {
  const renderCurrentView = () => {
    switch (currentView) {
      case 'CHOICE':
        return <ChoiceView key="choice" />;
      case 'URL_INPUT':
        return <URLInputView key="url-input" />;
      case 'MANUAL_INPUT':
        return <ManualInputView key="manual-input" />;
      case 'CODE_INPUT':
        return <CodeInputView key="code-input" />;
      case 'RESULTS':
        return <ResultsView key="results" />;
      default:
        return <ChoiceView key="choice" />;
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onBackdropClick}
          onKeyDown={onEscapeKey}
          tabIndex={-1}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Modal Content with View Transitions */}
            <div className="relative w-full h-full min-h-[600px] max-h-[90vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  variants={viewVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "spring", damping: 20 }}
                  className="absolute inset-0 flex flex-col"
                >
                  {renderCurrentView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}