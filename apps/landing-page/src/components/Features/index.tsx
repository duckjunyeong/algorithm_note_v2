import { useFeatures } from './useFeatures';
import { FeaturesView } from './Features.view';

export function Features() {
  const {} = useFeatures();
  return <FeaturesView />;
}