
import { useEffect } from 'react';
import { useStreakStore } from '../../store/useStreakStore';

export const useStreakCounter = () => {
  const {
    currentStreak,
    longestStreak,
    todayCompleted,
    isLoading,
    error,
    fetchStreakInfo,
  } = useStreakStore();

  useEffect(() => {
    fetchStreakInfo();
  }, [fetchStreakInfo]);

  return {
    currentStreak,
    longestStreak,
    todayCompleted,
    isLoading,
    error,
  };
};
