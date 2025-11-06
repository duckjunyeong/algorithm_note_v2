import { useChoiceReviewTypeModal, type UseChoiceReviewTypeModalProps } from './useChoiceReviewTypeModal';
import { ChoiceReviewTypeModalView } from './ChoiceReviewTypeModal.view';

export interface ChoiceReviewTypeModalProps extends UseChoiceReviewTypeModalProps {
}

export function ChoiceReviewTypeModal({ onTypeSelected }: ChoiceReviewTypeModalProps) {
  const {
    reviewTypes,
    selectedReviewType,
    handleSelectReviewType,
    handleConfirmSelection,
  } = useChoiceReviewTypeModal({ onTypeSelected });

  return (
    <ChoiceReviewTypeModalView
      reviewTypes={reviewTypes}
      selectedReviewType={selectedReviewType}
      onSelectReviewType={handleSelectReviewType}
      onConfirmSelection={handleConfirmSelection}
    />
  );
}