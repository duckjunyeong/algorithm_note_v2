import { useSelectionView } from './useSelectionView';
import type { UseSelectionViewProps } from './useSelectionView';
import { SelectionViewView } from './SelectionView.view';

export function SelectionView(props: UseSelectionViewProps) {
  const { reviewTypeOptions, handleSelectType, handleConfirm, isNextButtonEnabled } =
    useSelectionView(props);

  return (
    <SelectionViewView
      selectedReviewType={props.selectedReviewType}
      reviewTypeOptions={reviewTypeOptions}
      isNextButtonEnabled={isNextButtonEnabled}
      onSelectType={handleSelectType}
      onConfirm={handleConfirm}
    />
  );
}
