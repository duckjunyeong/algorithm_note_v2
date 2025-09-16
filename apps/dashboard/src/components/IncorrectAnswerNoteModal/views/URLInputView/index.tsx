import { useURLInputView } from './useURLInputView';
import { URLInputViewComponent } from './URLInputView.view';

export function URLInputView() {
  const {
    url,
    error,
    handleBack,
    handleUrlChange,
    handleNext
  } = useURLInputView();

  return (
    <URLInputViewComponent
      url={url}
      error={error}
      onBack={handleBack}
      onUrlChange={handleUrlChange}
      onNext={handleNext}
    />
  );
}