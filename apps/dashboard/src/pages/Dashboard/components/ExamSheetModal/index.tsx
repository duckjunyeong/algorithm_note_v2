import { useExamSheetModal } from './useExamSheetModal';
import { ExamSheetModalView } from './ExamSheetModal.view';

interface ExamSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamSheetModal({ isOpen, onClose }: ExamSheetModalProps) {
  const {
    selectedCardIds,
    sortBy,
    examTitle,
    setexamTitle,
    instruction,
    setInstruction,
    isLoading,
    errorMessage,
    sortedCards,
    allCardsCount,
    handleCardToggle,
    handleToggleAll,
    handleSortChange,
    handleGeneratePdf,
    resetModal,
  } = useExamSheetModal();

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBackgroundClick = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  return (
    <ExamSheetModalView
      isOpen={isOpen}
      onClose={handleClose}
      onBackgroundClick={handleBackgroundClick}
      selectedCardIds={selectedCardIds}
      sortBy={sortBy}
      examTitle={examTitle}
      setexamTitle={setexamTitle}
      instruction={instruction}
      setInstruction={setInstruction}
      isLoading={isLoading}
      errorMessage={errorMessage}
      sortedCards={sortedCards}
      allCardsCount={allCardsCount}
      onCardToggle={handleCardToggle}
      onToggleAll={handleToggleAll}
      onSortChange={handleSortChange}
      onGeneratePdf={handleGeneratePdf}
    />
  );
}
