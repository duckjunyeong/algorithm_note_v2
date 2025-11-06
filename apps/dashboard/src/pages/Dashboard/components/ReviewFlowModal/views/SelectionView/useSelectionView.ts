import { useMemo } from 'react';
import { FileText, Mic } from 'lucide-react';

export interface ReviewTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  disabled: boolean;
}

export interface UseSelectionViewProps {
  selectedReviewType: string | null;
  onSelectReviewType: (typeId: string) => void;
  onProceedToTest: () => void;
}

export function useSelectionView({
  selectedReviewType,
  onSelectReviewType,
  onProceedToTest,
}: UseSelectionViewProps) {
  const reviewTypeOptions: ReviewTypeOption[] = useMemo(
    () => [
      {
        id: 'text',
        label: '텍스트 입력',
        description: '키보드로 답변을 입력하여 복습합니다',
        icon: FileText,
        disabled: false,
      },
      {
        id: 'voice',
        label: '음성 녹음',
        description: '음성으로 답변을 녹음합니다 (준비중)',
        icon: Mic,
        disabled: true,
      },
    ],
    []
  );

  const handleSelectType = (typeId: string) => {
    const selectedOption = reviewTypeOptions.find((opt) => opt.id === typeId);
    if (selectedOption && !selectedOption.disabled) {
      onSelectReviewType(typeId);
    }
  };

  const handleConfirm = () => {
    if (selectedReviewType) {
      onProceedToTest();
    }
  };

  const isNextButtonEnabled = selectedReviewType !== null;

  return {
    reviewTypeOptions,
    handleSelectType,
    handleConfirm,
    isNextButtonEnabled,
  };
}
