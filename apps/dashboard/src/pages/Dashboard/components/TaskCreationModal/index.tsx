import { useTaskCreationModal } from './useTaskCreationModal';
import { TaskCreationModalView } from './TaskCreationModal.view';
import { useCategoryStore } from '../../../../store/useCategoryStore';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;

  onBackgroundClick?: () => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onSaveCategory: (name: string, color: string) => Promise<void>;
}

export function TaskCreationModal({
  isOpen,
  onClose,
  onBackgroundClick,
  categories,
  isLoadingCategories,
  categoryError,
  onSaveCategory
}: TaskCreationModalProps) {
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
    showCategoryForm,
    handleContinue,
    handleQuestionToggle,
    handleQuestionEdit,
    handleQuestionSave,
    handleQuestionDelete,
    handleEditModalClose,
    handleCategorySelect,
    handleAddCategoryClick,
    handleCloseCategoryForm,
    handleRegisterSelectedQuestions,
    resetModal
  } = useTaskCreationModal();

  const { selectedCategoryId } = useCategoryStore();

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

      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      onCategorySelect={handleCategorySelect}
      onAddCategoryClick={handleAddCategoryClick}

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