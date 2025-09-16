import { useChoiceView } from './useChoiceView';
import { ChoiceViewComponent } from './ChoiceView.view';

export function ChoiceView() {
  const { handleUrlChoice, handleManualChoice } = useChoiceView();

  return (
    <ChoiceViewComponent
      onUrlChoice={handleUrlChoice}
      onManualChoice={handleManualChoice}
    />
  );
}