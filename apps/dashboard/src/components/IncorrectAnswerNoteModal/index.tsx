import { useIncorrectAnswerNoteModal } from './useIncorrectAnswerNoteModal';
import { IncorrectAnswerNoteModalView } from './IncorrectAnswerNoteModal.view';

export function IncorrectAnswerNoteModal() {
  const {
    isModalOpen,
    currentView,
    handleClose,
    handleBackdropClick,
    handleEscapeKey
  } = useIncorrectAnswerNoteModal();

  return (
    <IncorrectAnswerNoteModalView
      isModalOpen={isModalOpen}
      currentView={currentView}
      onClose={handleClose}
      onBackdropClick={handleBackdropClick}
      onEscapeKey={handleEscapeKey}
    />
  );
}