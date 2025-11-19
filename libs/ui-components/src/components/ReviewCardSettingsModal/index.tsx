import { useReviewCardSettingsModal, type UseReviewCardSettingsModalProps } from './useReviewCardSettingsModal';
import { ReviewCardSettingsModalView } from './ReviewCardSettingsModal.view';

export function ReviewCardSettingsModal(props: UseReviewCardSettingsModalProps) {
  const {
    questions,
    editingQuestionId,
    editingQuestionText,
    newQuestionText,
    repetitionCycle,
    importance,
    url,
    selectedCategoryId,
    categories,
    isLoadingCategories,
    categoryError,
    isSaving,
    handleDeleteQuestion,
    handleStartEditQuestion,
    handleSaveEditQuestion,
    handleEditQuestionTextChange,
    handleNewQuestionTextChange,
    handleAddQuestion,
    handleRepetitionCycleChange,
    handleImportanceChange,
    handleUrlChange,
    handleCategorySelect,
    handleAddCategoryClick,
    handleSave,
    handleClose,
  } = useReviewCardSettingsModal(props);

  return (
    <ReviewCardSettingsModalView
      title={props.title}
      questions={questions}
      editingQuestionId={editingQuestionId}
      editingQuestionText={editingQuestionText}
      newQuestionText={newQuestionText}
      repetitionCycle={repetitionCycle}
      importance={importance}
      url={url}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isLoadingCategories={isLoadingCategories}
      categoryError={categoryError}
      isSaving={isSaving}
      onClose={handleClose}
      onSave={handleSave}
      onDeleteQuestion={handleDeleteQuestion}
      onStartEditQuestion={handleStartEditQuestion}
      onSaveEditQuestion={handleSaveEditQuestion}
      onEditQuestionTextChange={handleEditQuestionTextChange}
      onNewQuestionTextChange={handleNewQuestionTextChange}
      onAddQuestion={handleAddQuestion}
      onRepetitionCycleChange={handleRepetitionCycleChange}
      onImportanceChange={handleImportanceChange}
      onUrlChange={handleUrlChange}
      onCategorySelect={handleCategorySelect}
      onAddCategoryClick={handleAddCategoryClick}
    />
  );
}

export type { UseReviewCardSettingsModalProps as ReviewCardSettingsModalProps };
