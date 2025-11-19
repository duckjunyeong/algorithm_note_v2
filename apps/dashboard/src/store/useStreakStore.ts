
import { create } from 'zustand';
import type { StreakInfo } from '../../../../libs/api-types/src';
import { ActivityService } from '../services/activityService';
import { getTodayDateString } from '../../../../libs/core-logic/src';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  todayCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

interface StreakActions {
  fetchStreakInfo: () => Promise<void>;
  recordCompletion: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type StreakStore = StreakState & StreakActions;

const initialState: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  todayCompleted: false,
  isLoading: false,
  error: null,
};

export const useStreakStore = create<StreakStore>((set) => ({
  ...initialState,

  fetchStreakInfo: async () => {
    set({ isLoading: true, error: null });

    try {
      const streakInfo = await ActivityService.getStreakInfo();

      set({
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        lastCompletedDate: streakInfo.lastCompletedDate,
        todayCompleted: streakInfo.todayCompleted,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '스트릭 정보를 불러올 수 없습니다.',
        isLoading: false,
      });
    }
  },

  recordCompletion: async () => {
    try {
      await ActivityService.recordCompletion({
        activityDate: getTodayDateString(),
        reviewCardsCompleted: 1,
      });

      const streakInfo = await ActivityService.getStreakInfo();

      set({
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        lastCompletedDate: streakInfo.lastCompletedDate,
        todayCompleted: streakInfo.todayCompleted,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '활동 기록에 실패했습니다.',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
