// FeatureSection/index.tsx
import { FeatureSectionView } from './FeatureSection.view';
import { useFeatureSection } from './useFeatureSection';

export const FeatureSection = () => {
  // 훅에서 반환된 객체를 구조 분해하여 받아옵니다.
  const { handleAccordionToggle, ...otherProps } = useFeatureSection();

  return (
    <FeatureSectionView
      // onAccordionToggle prop에 handleAccordionToggle 함수를 명시적으로 전달합니다.
      onAccordionToggle={handleAccordionToggle}
      // 나머지 props는 그대로 전달합니다.
      {...otherProps}
    />
  );
};