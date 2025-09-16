import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { ChoiceView } from './views/ChoiceView';
import { URLInputView } from './views/URLInputView';
import { ManualInputView } from './views/ManualInputView';
import { CodeInputView } from './views/CodeInputView';
import { ResultsView } from './views/ResultsView';
import type { ViewType } from '../../store/useIncorrectAnswerNoteStore';

interface IncorrectAnswerNoteModalViewProps {
  isModalOpen: boolean;
  isExitConfirmationVisible: boolean;
  currentView: ViewType;
  problemData: any;
  submissionType: 'url' | 'manual' | null;
  codeData: any;
  analysisResult: any[];
  selectedAnalysisIndex: number;
  isLoading: boolean;
  error: string | null;
  onOverlayClick: () => void;
  onExitConfirm: () => void;
  onExitCancel: () => void;
  onBackClick: () => void;
  onChoiceSelect: (type: 'url' | 'manual') => void;
  onNext: () => void;
  onAnalyze: () => void;
  onAnalysisSelect: (index: number) => void;
  onGenerateNote: () => void;
  onProblemDataChange: (data: any) => void;
  onCodeDataChange: (data: any) => void;
}

const modalSizes = {
  CHOICE: { maxWidth: 'max-w-2xl', height: 'h-[420px]' },
  URL_INPUT: { maxWidth: 'max-w-xl', height: 'h-[380px]' },
  MANUAL_INPUT: { maxWidth: 'max-w-3xl', height: 'h-[650px]' },
  CODE_INPUT: { maxWidth: 'max-w-4xl', height: 'h-[650px]' },
  RESULTS: { maxWidth: 'max-w-5xl', height: 'h-[700px]' },
};

export function IncorrectAnswerNoteModalView({
  isModalOpen,
  isExitConfirmationVisible,
  currentView,
  problemData,
  submissionType,
  codeData,
  analysisResult,
  selectedAnalysisIndex,
  isLoading,
  error,
  onOverlayClick,
  onExitConfirm,
  onExitCancel,
  onBackClick,
  onChoiceSelect,
  onNext,
  onAnalyze,
  onAnalysisSelect,
  onGenerateNote,
  onProblemDataChange,
  onCodeDataChange,
}: IncorrectAnswerNoteModalViewProps) {
  const canShowBack = currentView !== 'CHOICE';
  const currentSize = modalSizes[currentView];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'CHOICE':
        return <ChoiceView onChoiceSelect={onChoiceSelect} />;
      case 'URL_INPUT':
        return (
          <URLInputView
            problemData={problemData}
            onProblemDataChange={onProblemDataChange}
            onNext={onNext}
          />
        );
      case 'MANUAL_INPUT':
        return (
          <ManualInputView
            problemData={problemData}
            onProblemDataChange={onProblemDataChange}
            onNext={onNext}
          />
        );
      case 'CODE_INPUT':
        return (
          <CodeInputView
            codeData={codeData}
            onCodeDataChange={onCodeDataChange}
            onAnalyze={onAnalyze}
            isLoading={isLoading}
          />
        );
      case 'RESULTS':
        return (
          <ResultsView
            analysisResult={analysisResult}
            selectedAnalysisIndex={selectedAnalysisIndex}
            onAnalysisSelect={onAnalysisSelect}
            onGenerateNote={onGenerateNote}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={onOverlayClick}
          />

          {/* Modal Container */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`relative bg-gray-900 rounded-xl shadow-2xl ${currentSize.maxWidth} ${currentSize.height} transition-all duration-300 ease-in-out`}
          >
            {/* Back Button */}
            {canShowBack && (
              <button
                onClick={onBackClick}
                className="absolute top-6 left-6 z-10 p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20 rounded-xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  <p className="text-white text-lg">Analyzing your code...</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md z-20">
                {error}
              </div>
            )}

            {/* Modal Content */}
            <div className="h-full flex flex-col">
              {renderCurrentView()}
            </div>
          </motion.div>

          {/* Exit Confirmation Dialog */}
          <AnimatePresence>
            {isExitConfirmationVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center z-60"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-800 rounded-lg p-6 max-w-md mx-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <X className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Confirm Exit</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Are you sure you want to cancel the operation and exit?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={onExitCancel}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onExitConfirm}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}