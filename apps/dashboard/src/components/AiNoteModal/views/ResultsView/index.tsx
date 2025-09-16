import { useResultsView } from './useResultsView';
import { ResultsViewComponent } from './ResultsView.view';

export function ResultsView() {
  const {
    analysisResult,
    hasSelectedUnits,
    handleUnitToggle,
    handleGenerate,
    handleBack,
  } = useResultsView();

  return (
    <ResultsViewComponent
      analysisResult={analysisResult}
      hasSelectedUnits={hasSelectedUnits}
      onUnitToggle={handleUnitToggle}
      onGenerate={handleGenerate}
      onBack={handleBack}
    />
  );
}