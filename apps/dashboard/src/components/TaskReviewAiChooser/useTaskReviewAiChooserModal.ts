import { useState, useCallback } from 'react';
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

  const handleSelectAiMode = useCallback((modeId: string) => {
    const aiMode = modeId as AiMode;
    setSelectedAiMode(aiMode);
    setSelectedTutorLevel(AI_MODE_TO_TUTOR_LEVEL[aiMode]);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedAiMode(null);
    setSelectedTutorLevel(null);
    setShowChatModal(false);
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
    onClose();
  }, [onClose]);

  return {
    isOpen,
    selectedAiMode,
    selectedTutorLevel,
    reviewCardId,
    reviewCard,
    showChatModal,
    handleSelectAiMode,
    handleCancel,
    handleNext,
    handleChatModalClose,
  };
}
