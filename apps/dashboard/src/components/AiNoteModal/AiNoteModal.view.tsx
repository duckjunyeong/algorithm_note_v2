import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { type ModalView } from '../../store/useAiNoteModalStore';

interface AiNoteModalViewProps {
  isModalOpen: boolean;
  isExitConfirmationVisible: boolean;
  currentView: ModalView;
  viewSizes: { width: string; height: string };
  children: React.ReactNode;
  onOverlayClick: () => void;
  onConfirmExit: () => void;
  onCancelExit: () => void;
}

export function AiNoteModalView({
  isModalOpen,
  isExitConfirmationVisible,
  currentView,
  viewSizes,
  children,
  onOverlayClick,
  onConfirmExit,
  onCancelExit,
}: AiNoteModalViewProps) {
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={onOverlayClick}
          />

          {/* Modal Container with Dynamic Sizing */}
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`
              relative z-10 w-full mx-4 bg-white rounded-lg shadow-2xl
              transition-all duration-300 ease-in-out
              ${viewSizes.width} ${viewSizes.height}
            `}
          >
            {children}

            {/* Exit Confirmation Dialog */}
            <AnimatePresence>
              {isExitConfirmationVisible && (
                <>
                  {/* Overlay for confirmation dialog */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-20"
                  />

                  {/* Confirmation Dialog */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                               bg-white rounded-lg p-6 shadow-xl z-30 max-w-sm w-full mx-4"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Confirm Exit
                      </h3>
                    </div>

                    <p className="text-gray-600 mb-6">
                      Are you sure you want to exit? Any unsaved progress will be lost.
                    </p>

                    <div className="flex space-x-3">
                      <button
                        onClick={onCancelExit}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md
                                 hover:bg-gray-50 transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onConfirmExit}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md
                                 hover:bg-red-700 transition duration-200"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}