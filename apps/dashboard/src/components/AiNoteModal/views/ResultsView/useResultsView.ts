import { useAiNoteModalStore } from '../../../../store/useAiNoteModalStore';

export function useResultsView() {
  const {
    analysisResult,
    toggleAnalysisSelection,
    closeModal,
    setCurrentView,
  } = useAiNoteModalStore();

  const selectedUnits = analysisResult.filter(unit => unit.selected);
  const hasSelectedUnits = selectedUnits.length > 0;

  const handleUnitToggle = (index: number) => {
    toggleAnalysisSelection(index);
  };

  const handleGenerate = () => {
    // In a real implementation, this would send the selected logic to the backend
    console.log('Generating notes with selected logic:', selectedUnits);

    // For now, just close the modal with success
    alert(`Generated incorrect answer notes for ${selectedUnits.length} selected logic units!`);
    closeModal();
  };

  const handleBack = () => {
    setCurrentView('CODE_INPUT');
  };

  return {
    analysisResult,
    selectedUnits,
    hasSelectedUnits,
    handleUnitToggle,
    handleGenerate,
    handleBack,
  };
}