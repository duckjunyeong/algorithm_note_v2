import { useState } from 'react';
import type { AiMode } from '../../../../components/TaskReviewAiChooser/useTaskReviewAiChooserModal';

export type ReviewFlowView = 'ai-selection' | 'test';

export interface UseReviewFlowModalProps {
  isOpen: boolean;
  reviewCardId: number | null;
  reviewCard: any | null;
  onClose: () => void;
}

export function useReviewFlowModal({
  isOpen,
  reviewCardId,
  reviewCard,
  onClose,
}: UseReviewFlowModalProps) {
  const [currentView, setCurrentView] = useState<ReviewFlowView>('ai-selection');
  const [selectedAiMode, setSelectedAiMode] = useState<AiMode | null>(null);

  const handleSelectAiMode = (modeId: string) => {
    setSelectedAiMode(modeId as AiMode);
  };

  const handleProceedToTest = () => {
    if (selectedAiMode) {
      setCurrentView('test');
    }
  };

  const handleBackToAiSelection = () => {
    setCurrentView('ai-selection');
  };

  const handleClose = () => {
    setCurrentView('ai-selection');
    setSelectedAiMode(null);
    onClose();
  };

  return {
    currentView,
    selectedAiMode,
    reviewCardId,
    reviewCard,
    handleSelectAiMode,
    handleProceedToTest,
    handleBackToAiSelection,
    handleClose,
    isOpen,
  };
}
