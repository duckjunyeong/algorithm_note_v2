import { useState } from 'react';

export type ReviewFlowView = 'selection' | 'test';

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
  const [currentView, setCurrentView] = useState<ReviewFlowView>('selection');
  const [selectedReviewType, setSelectedReviewType] = useState<string | null>(null);

  const handleSelectReviewType = (typeId: string) => {
    setSelectedReviewType(typeId);
  };

  const handleProceedToTest = () => {
    if (selectedReviewType === 'text') {
      setCurrentView('test');
    } else {
      alert('준비 중인 기능입니다.');
    }
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
  };

  const handleClose = () => {
    setCurrentView('selection');
    setSelectedReviewType(null);
    onClose();
  };

  return {
    currentView,
    selectedReviewType,
    reviewCardId,
    reviewCard,
    handleSelectReviewType,
    handleProceedToTest,
    handleBackToSelection,
    handleClose,
    isOpen,
  };
}
