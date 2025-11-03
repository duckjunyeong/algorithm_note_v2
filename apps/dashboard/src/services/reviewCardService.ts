import apiClient from './apiClient';
import type {
  CreateReviewCardRequest,
  CreateReviewCardResponse,
  ReviewCard,
  ReviewCardResultResponse,
} from '../../../../libs/api-types/src';

import type { UpdateReviewResultRequest } from '../../../../libs/api-types/src/review-card.types';

export class ReviewCardService {

  static async createReviewCard(data: CreateReviewCardRequest): Promise<CreateReviewCardResponse> {
    try {
      const response = await apiClient.post<CreateReviewCardResponse>('/reviewCard/create', data);
      return response.data;
    } catch (error) {
      console.error('복습 카드 생성 실패:', error);
      throw error;
    }
  }

  static async getReviewCards(): Promise<ReviewCard[]> {
    try {
      const response = await apiClient.get<ReviewCard[]>('/reviewCard');
      return response.data;
    } catch (error) {
      console.error('복습 카드 목록 조회 실패:', error);
      throw error;
    }
  }

  static async updateReviewCardStatus(reviewCardId: number, isActive: boolean): Promise<void> {
    try {
      await apiClient.patch(`/reviewCard/${reviewCardId}/status`, { isActive });
    } catch (error) {
      console.error('복습 카드 상태 업데이트 실패:', error);
      throw error;
    }
  }

  static async updateReviewResult(reviewCardId: number, data: UpdateReviewResultRequest): Promise<void> {
    try {
      await apiClient.put(`/reviewCard/${reviewCardId}/result`, data);
    } catch (error) {
      console.error('복습 결과 저장 실패:', error);
      throw error;
    }
  }

  static async deleteReviewCard(reviewCardId: number): Promise<void> {
    try {
      await apiClient.delete(`/reviewCard/${reviewCardId}`);
    } catch (error) {
      console.error('복습 카드 삭제 실패:', error);
      throw error;
    }
  }

  static async incrementReviewCount(reviewCardId: number): Promise<void> {
    try {
      await apiClient.post(`/reviewCard/${reviewCardId}/review`);
    } catch (error) {
      console.error('복습 횟수 증가 실패:', error);
      throw error;
    }
  }

  static async getReviewCardResults(reviewCardId: number): Promise<ReviewCardResultResponse> {
    try {
      const response = await apiClient.get<ReviewCardResultResponse>(
        `/reviewCard/${reviewCardId}/results`
      );
      return response.data;
    } catch (error) {
      console.error('복습 카드 결과 조회 실패:', error);
      throw error;
    }
  }
}