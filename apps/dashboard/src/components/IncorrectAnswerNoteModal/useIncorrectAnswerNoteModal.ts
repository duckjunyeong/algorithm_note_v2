import { useCallback } from 'react';
import { useIncorrectAnswerNoteStore } from '../../store/useIncorrectAnswerNoteStore';

export function useIncorrectAnswerNoteModal() {
  const {
    isModalOpen,
    currentView,
    closeModal,
    resetModal
  } = useIncorrectAnswerNoteStore();

  const handleClose = useCallback(() => {
    closeModal();
    // Reset the modal state when closing
    setTimeout(() => {
      resetModal();
    }, 300); // Wait for animation to complete
  }, [closeModal, resetModal]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleEscapeKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  return {
    isModalOpen,
    currentView,
    handleClose,
    handleBackdropClick,
    handleEscapeKey
  };
}