import { useChoiceView } from './useChoiceView';
import { ChoiceViewComponent } from './ChoiceView.view';

export function ChoiceView() {
  const { handleUrlSelection, handleManualSelection } = useChoiceView();

  return (
    <ChoiceViewComponent
      onUrlSelection={handleUrlSelection}
      onManualSelection={handleManualSelection}
    />
  );
}