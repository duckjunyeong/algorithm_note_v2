import { useReviewCardSettingsModal, type UseReviewCardSettingsModalProps } from './useReviewCardSettingsModal';
import { ReviewCardSettingsModalView } from './ReviewCardSettingsModal.view';
import { ConfirmModal } from '../ConfirmModal';

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
    isDeleteConfirmOpen,
    isDeleting,
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
    handleDeleteCardClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClose,
  } = useReviewCardSettingsModal(props);

  return (
    <>
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
        onDeleteCard={handleDeleteCardClick}
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

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="복습 카드 삭제"
        message="이 복습 카드를 삭제하시겠습니까? 모든 질문과 답변 기록이 함께 삭제됩니다."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
}

export type { UseReviewCardSettingsModalProps as ReviewCardSettingsModalProps };
