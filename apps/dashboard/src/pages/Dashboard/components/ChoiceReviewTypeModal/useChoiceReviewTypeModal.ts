import { useState, useMemo } from 'react';
import { reviewTypeIcons } from './ChoiceReviewTypeModal.view'; // View 파일에서 아이콘 맵 가져오기

interface ReviewType {
  id: string;
  label: string;
}

export interface UseChoiceReviewTypeModalProps {
  onTypeSelected?: (typeId: string) => void;
}

export function useChoiceReviewTypeModal({ onTypeSelected }: UseChoiceReviewTypeModalProps) {
  const [selectedReviewType, setSelectedReviewType] = useState<string | null>(null);

  // 리뷰 유형 데이터
  const reviewTypesData: ReviewType[] = useMemo(() => [
    { id: 'voice', label: 'Voice' },
    { id: 'text', label: 'Text' },
  ], []);

  // View에 전달할 reviewTypes 데이터 (아이콘 포함)
  const reviewTypesWithIcons = useMemo(() => {
    return reviewTypesData.map(type => ({
      ...type,
      icon: reviewTypeIcons[type.id as keyof typeof reviewTypeIcons], // 적절한 아이콘 매핑
    }));
  }, [reviewTypesData]);


  const handleSelectReviewType = (typeId: string) => {
    setSelectedReviewType(typeId);
  };

  const handleConfirmSelection = () => {
    if (selectedReviewType) {
      console.log(`Selected review type: ${selectedReviewType}`);
      onTypeSelected?.(selectedReviewType); // 외부 콜백 호출
      // 선택 후 다음 단계로 이동하거나 모달을 닫는 등의 로직을 여기에 추가할 수 있습니다.
    } else {
      alert('리뷰 유형을 선택해주세요.'); // 선택하지 않았을 때의 처리
    }
  };

  return {
    reviewTypes: reviewTypesWithIcons,
    selectedReviewType,
    handleSelectReviewType,
    handleConfirmSelection,
  };
}