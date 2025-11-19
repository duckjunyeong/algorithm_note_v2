interface StreakCounterViewProps {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

export const StreakCounterView = ({
  currentStreak,
  longestStreak,
  todayCompleted,
  isLoading,
  error,
}: StreakCounterViewProps) => {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-text-tertiary">스트릭 정보를 불러올 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-text-primary">{currentStreak}</span>
        <span className="text-xl text-text-secondary">일째</span>
      </div>

      <div className="text-sm text-text-tertiary">
        최고: {longestStreak}일
      </div>

      {todayCompleted && (
        <div className="mt-2 rounded-full bg-background-tertiary px-3 py-1 text-xs text-text-secondary">
          오늘 학습 완료
        </div>
      )}
    </div>
  );
};
