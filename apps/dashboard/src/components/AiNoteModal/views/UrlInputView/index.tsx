import { useUrlInputView } from './useUrlInputView';
import { UrlInputViewComponent } from './UrlInputView.view';

export function UrlInputView() {
  const {
    url,
    error,
    handleUrlChange,
    handleNext,
    handleBack,
  } = useUrlInputView();

  return (
    <UrlInputViewComponent
      url={url}
      error={error}
      onUrlChange={handleUrlChange}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}