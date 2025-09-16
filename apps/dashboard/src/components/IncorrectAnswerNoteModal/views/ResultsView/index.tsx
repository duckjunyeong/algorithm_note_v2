import { useResultsView } from './useResultsView';
import { ResultsViewComponent } from './ResultsView.view';

export function ResultsView() {
  const {
    analysisResult,
    selectedLogic,
    selectedLogicId,
    handleLogicSelect,
    handleGenerate
  } = useResultsView();

  return (
    <ResultsViewComponent
      analysisResult={analysisResult}
      selectedLogic={selectedLogic}
      selectedLogicId={selectedLogicId}
      onLogicSelect={handleLogicSelect}
      onGenerate={handleGenerate}
    />
  );
}