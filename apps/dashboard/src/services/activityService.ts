import apiClient from './apiClient';
import type {
  RecordCompletionRequest,
  RecordCompletionResponse,
  StreakInfoResponse,
  ActivityRecord,
} from '../../../../libs/api-types/src';

export class ActivityService {
  static async recordCompletion(data: RecordCompletionRequest): Promise<RecordCompletionResponse> {
    try {
      const response = await apiClient.post<RecordCompletionResponse>('/activity/completion', data);
      return response.data;
    } catch (error) {
      console.error('활동 기록 실패:', error);
      throw error;
    }
  }

  static async getStreakInfo(): Promise<StreakInfoResponse> {
    try {
      const response = await apiClient.get<StreakInfoResponse>('/activity/streak');
      return response.data;
    } catch (error) {
      console.error('스트릭 정보 조회 실패:', error);
      throw error;
    }
  }

  static async getActivityHistory(startDate: string, endDate: string): Promise<ActivityRecord[]> {
    try {
      const response = await apiClient.get<ActivityRecord[]>('/activity/history', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('활동 히스토리 조회 실패:', error);
      throw error;
    }
  }
}
