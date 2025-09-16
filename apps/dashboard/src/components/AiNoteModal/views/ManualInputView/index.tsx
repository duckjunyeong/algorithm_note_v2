import { useManualInputView } from './useManualInputView';
import { ManualInputViewComponent } from './ManualInputView.view';

export function ManualInputView() {
  const {
    formData,
    errors,
    handleInputChange,
    handleNext,
    handleBack,
  } = useManualInputView();

  return (
    <ManualInputViewComponent
      formData={formData}
      errors={errors}
      onInputChange={handleInputChange}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}