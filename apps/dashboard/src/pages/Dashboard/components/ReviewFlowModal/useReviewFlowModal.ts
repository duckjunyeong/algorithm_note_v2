import { useState } from 'react';
import type { AiMode } from '../../../../components/TaskReviewAiChooser/useTaskReviewAiChooserModal';

export type ReviewFlowView = 'ai-selection' | 'test' | 'chat-test';

export interface UseReviewFlowModalProps {
  isOpen: boolean;
  reviewCardId: number | null;
  reviewCard: any | null;
  onClose: () => void;
}

const AI_MODE_TO_TUTOR_LEVEL: Record<AiMode, string> = {
  'beginner-tutor': 'beginner',
  'advanced-tutor': 'advanced',
  'prof-tutor': 'professor',
  'normal-tutor': 'normal',
};

export function useReviewFlowModal({
  isOpen,
  reviewCardId,
  reviewCard,
  onClose,
}: UseReviewFlowModalProps) {
  const [currentView, setCurrentView] = useState<ReviewFlowView>('ai-selection');
  const [selectedAiMode, setSelectedAiMode] = useState<AiMode | null>(null);
  const [selectedTutorLevel, setSelectedTutorLevel] = useState<string | null>(null);

  const handleSelectAiMode = (modeId: string) => {
    const aiMode = modeId as AiMode;
    setSelectedAiMode(aiMode);
    setSelectedTutorLevel(AI_MODE_TO_TUTOR_LEVEL[aiMode]);
  };

  const handleProceedToTest = () => {
    if (selectedAiMode && selectedTutorLevel) {
      setCurrentView('chat-test');
    }
  };

  const handleBackToAiSelection = () => {
    setCurrentView('ai-selection');
  };

  const handleClose = () => {
    setCurrentView('ai-selection');
    setSelectedAiMode(null);
    setSelectedTutorLevel(null);
    onClose();
  };

  return {
    currentView,
    selectedAiMode,
    selectedTutorLevel,
    reviewCardId,
    reviewCard,
    handleSelectAiMode,
    handleProceedToTest,
    handleBackToAiSelection,
    handleClose,
    isOpen,
  };
}
