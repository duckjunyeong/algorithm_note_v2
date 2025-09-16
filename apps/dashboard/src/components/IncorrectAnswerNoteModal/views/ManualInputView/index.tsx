import { useManualInputView } from './useManualInputView';
import { ManualInputViewComponent } from './ManualInputView.view';

export function ManualInputView() {
  const {
    formData,
    errors,
    handleBack,
    handleInputChange,
    handleNext
  } = useManualInputView();

  return (
    <ManualInputViewComponent
      formData={formData}
      errors={errors}
      onBack={handleBack}
      onInputChange={handleInputChange}
      onNext={handleNext}
    />
  );
}