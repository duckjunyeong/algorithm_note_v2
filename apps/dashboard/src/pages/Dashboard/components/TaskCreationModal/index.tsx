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
    selectedQuestions,
    editingQuestion,
    repetitionCycle,
    setRepetitionCycle,
    importance,
    setImportance,
    category,
    setCategory,
    categoryColor,
    setCategoryColor,
    handleContinue,
    handleQuestionToggle,
    handleQuestionEdit,
    handleQuestionSave,
    handleQuestionDelete,
    handleEditModalClose,
    handleRegisterSelectedQuestions,
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
      selectedQuestions={selectedQuestions}
      editingQuestion={editingQuestion}
      repetitionCycle={repetitionCycle}
      setRepetitionCycle={setRepetitionCycle}
      importance={importance}
      setImportance={setImportance}
      category={category}
      setCategory={setCategory}
      categoryColor={categoryColor}
      setCategoryColor={setCategoryColor}
      onContinue={handleContinue}
      onQuestionToggle={handleQuestionToggle}
      onQuestionEdit={handleQuestionEdit}
      onQuestionSave={handleQuestionSave}
      onQuestionDelete={handleQuestionDelete}
      onEditModalClose={handleEditModalClose}
      onRegisterSelectedQuestions={handleRegisterSelectedQuestions}
    />
  );
}

export type { TaskCreationModalProps };