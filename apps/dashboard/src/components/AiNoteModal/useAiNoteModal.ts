import { useEffect } from 'react';
import { useAiNoteModalStore, type ModalView } from '../../store/useAiNoteModalStore';

const VIEW_SIZES: Record<ModalView, { width: string; height: string }> = {
  CHOICE: { width: 'max-w-2xl', height: 'h-[420px]' },
  URL_INPUT: { width: 'max-w-xl', height: 'h-[380px]' },
  MANUAL_INPUT: { width: 'max-w-3xl', height: 'h-[650px]' },
  CODE_INPUT: { width: 'max-w-4xl', height: 'h-[650px]' },
  RESULTS: { width: 'max-w-5xl', height: 'h-[700px]' }
};

export function useAiNoteModal() {
  const {
    isModalOpen,
    isExitConfirmationVisible,
    currentView,
    closeModal,
    showExitConfirmation,
    hideExitConfirmation,
  } = useAiNoteModalStore();

  const viewSizes = VIEW_SIZES[currentView];

  const handleOverlayClick = () => {
    if (!isExitConfirmationVisible) {
      showExitConfirmation();
    }
  };

  const handleConfirmExit = () => {
    hideExitConfirmation();
    closeModal();
  };

  const handleCancelExit = () => {
    hideExitConfirmation();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen && !isExitConfirmationVisible) {
        showExitConfirmation();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, isExitConfirmationVisible, showExitConfirmation]);

  return {
    isModalOpen,
    isExitConfirmationVisible,
    currentView,
    viewSizes,
    handleOverlayClick,
    handleConfirmExit,
    handleCancelExit,
  };
}