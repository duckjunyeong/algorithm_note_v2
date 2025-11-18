import { useState, useCallback, useEffect } from 'react';
import type React from 'react';

export type AiMode = 'beginner-tutor' | 'advanced-tutor' | 'prof-tutor' | 'normal-tutor';

export interface AiModeOption {
  id: AiMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
}

export interface UseTaskReviewAiChooserModalProps {
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

export function useTaskReviewAiChooserModal({
  isOpen,
  reviewCardId,
  reviewCard,
  onClose,
}: UseTaskReviewAiChooserModalProps) {
  const [selectedAiMode, setSelectedAiMode] = useState<AiMode | null>(null);
  const [selectedTutorLevel, setSelectedTutorLevel] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Reset internal states when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('[useTaskReviewAiChooserModal] Modal opened - resetting states');

      // If taskType is not 'concept', immediately show ChatModal with 'normal' tutor level
      if (reviewCard?.taskType !== 'concept') {
        console.log('[useTaskReviewAiChooserModal] Non-concept task - opening ChatModal immediately');
        setSelectedTutorLevel('normal');
        setShowChatModal(true);
        setShowResultModal(false);
        setSelectedAiMode(null);
      } else {
        // For 'concept' tasks, show AI mode selection screen
        console.log('[useTaskReviewAiChooserModal] Concept task - showing AI mode selection');
        setShowChatModal(false);
        setShowResultModal(false);
        setSelectedAiMode(null);
        setSelectedTutorLevel(null);
      }
    }
  }, [isOpen, reviewCard?.taskType]);

  const handleSelectAiMode = useCallback((modeId: string) => {
    const aiMode = modeId as AiMode;
    setSelectedAiMode(aiMode);
    setSelectedTutorLevel(AI_MODE_TO_TUTOR_LEVEL[aiMode]);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedAiMode(null);
    setSelectedTutorLevel(null);
    setShowChatModal(false);
    setShowResultModal(false);
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (selectedAiMode && selectedTutorLevel) {
      setShowChatModal(true);
    }
  }, [selectedAiMode, selectedTutorLevel]);

  const handleChatModalClose = useCallback(() => {
    setShowChatModal(false);
    setSelectedAiMode(null);
    setSelectedTutorLevel(null);
    setShowResultModal(false);
    onClose();
  }, [onClose]);

  const handleReviewTestNext = useCallback(() => {
    setShowChatModal(false);
    setShowResultModal(true);
  }, []);

  const handleTaskResultClose = useCallback(() => {
    setShowResultModal(false);
    setSelectedAiMode(null);
    setSelectedTutorLevel(null);
    setShowChatModal(false);
    onClose();
  }, [onClose]);

  return {
    isOpen,
    selectedAiMode,
    selectedTutorLevel,
    reviewCardId,
    reviewCard,
    showChatModal,
    showResultModal,
    handleSelectAiMode,
    handleCancel,
    handleNext,
    handleChatModalClose,
    handleReviewTestNext,
    handleTaskResultClose,
  };
}
