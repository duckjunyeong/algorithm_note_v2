import { useTaskCreationModal } from './useTaskCreationModal';
import { TaskCreationModalView } from './TaskCreationModal.view';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
}

export function TaskCreationModal({ isOpen, onClose, onBackgroundClick }: TaskCreationModalProps) {
  const {
    currentView,
    inputValue,
    setInputValue,
    errorMessage,
    isLoading,
    questions,
    handleContinue,
    handleQuestionRegister,
    resetModal
  } = useTaskCreationModal();

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBackgroundClick = () => {
    if (onBackgroundClick) {
      onBackgroundClick();
    } else {
      handleClose();
    }
  };

  return (
    <TaskCreationModalView
      isOpen={isOpen}
      onClose={handleClose}
      onBackgroundClick={handleBackgroundClick}
      currentView={currentView}
      inputValue={inputValue}
      setInputValue={setInputValue}
      errorMessage={errorMessage}
      isLoading={isLoading}
      questions={questions}
      onContinue={handleContinue}
      onQuestionRegister={handleQuestionRegister}
    />
  );
}

export type { TaskCreationModalProps };