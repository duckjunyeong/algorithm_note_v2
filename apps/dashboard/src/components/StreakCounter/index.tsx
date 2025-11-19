import { useStreakCounter } from './useStreakCounter';
import { StreakCounterView } from './StreakCounter.view';

export const StreakCounter = () => {
  const streakData = useStreakCounter();

  return <StreakCounterView {...streakData} />;
};