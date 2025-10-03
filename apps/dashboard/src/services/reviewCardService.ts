import apiClient from './apiClient';
import type {
  CreateReviewCardRequest,
  CreateReviewCardResponse,
  GetReviewCardsResponse,
  ReviewCard,
  ReviewCardResultResponse,
} from '../../../../libs/api-types/src';

import type { UpdateReviewResultRequest } from '../../../../libs/api-types/src/review-card.types';

/**
 * 복습 카드 관련 API 호출 서비스
 */
export class ReviewCardService {
  /**
   * 신규 복습 카드 생성
   * @param data 복습 카드 생성 요청 데이터
   * @returns 생성된 복습 카드 정보
   */
  static async createReviewCard(data: CreateReviewCardRequest): Promise<CreateReviewCardResponse> {
    try {
      const response = await apiClient.post<CreateReviewCardResponse>('/reviewCard/create', data);
      return response.data;
    } catch (error) {
      console.error('복습 카드 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자의 모든 복습 카드 목록 조회
   * @returns 복습 카드 목록
   */
  static async getReviewCards(): Promise<ReviewCard[]> {
    try {
      const response = await apiClient.get<ReviewCard[]>('/reviewCard');
      return response.data;
    } catch (error) {
      console.error('복습 카드 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 복습 카드 상태 업데이트 (활성화/비활성화)
   * @param reviewCardId 복습 카드 ID
   * @param isActive 활성화 상태
   */
  static async updateReviewCardStatus(reviewCardId: number, isActive: boolean): Promise<void> {
    try {
      await apiClient.patch(`/api/reviewCard/${reviewCardId}/status`, { isActive });
    } catch (error) {
      console.error('복습 카드 상태 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 복습 테스트 결과를 저장합니다
   * @param reviewCardId 복습 카드 ID
   * @param data 업데이트 요청 데이터
   */
  static async updateReviewResult(reviewCardId: number, data: UpdateReviewResultRequest): Promise<void> {
    try {
      await apiClient.put(`/reviewCard/${reviewCardId}/result`, data);
    } catch (error) {
      console.error('복습 결과 저장 실패:', error);
      throw error;
    }
  }

  /**
   * 복습 카드를 삭제합니다
   * @param reviewCardId 복습 카드 ID
   */
  static async deleteReviewCard(reviewCardId: number): Promise<void> {
    try {
      await apiClient.delete(`/reviewCard/${reviewCardId}`);
    } catch (error) {
      console.error('복습 카드 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 복습 횟수를 증가시킵니다
   * @param reviewCardId 복습 카드 ID
   */
  static async incrementReviewCount(reviewCardId: number): Promise<void> {
    try {
      await apiClient.post(`/reviewCard/${reviewCardId}/review`);
    } catch (error) {
      console.error('복습 횟수 증가 실패:', error);
      throw error;
    }
  }

  /**
   * 비활성화된 복습 카드의 질문과 답변 목록을 조회합니다
   * @param reviewCardId 복습 카드 ID
   * @returns 질문별 답변 목록
   */
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