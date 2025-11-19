export interface ActivityRecord {
  activityId: number;
  activityDate: string;
  reviewCardsCompleted: number;
  questionsAnswered: number;
  studyTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  todayCompleted: boolean;
}

export interface RecordCompletionRequest {
  activityDate: string;
  reviewCardsCompleted?: number;
  questionsAnswered?: number;
  studyTimeMinutes?: number;
}

export interface RecordCompletionResponse {
  success: boolean;
  message: string;
  activityRecord: ActivityRecord;
}

export interface StreakInfoResponse {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  todayCompleted: boolean;
}
