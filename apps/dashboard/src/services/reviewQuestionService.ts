import apiClient from './apiClient';

export interface ReviewQuestionResponseDto {
  reviewQuestionId: number;
  questionText: string;
  createdAt: string;
}

export class ReviewQuestionService {

  static async getQuestionsByReviewCardId(reviewCardId: number): Promise<ReviewQuestionResponseDto[]> {
    try {
      const response = await apiClient.get<ReviewQuestionResponseDto[]>(
        `/review-questions/review-card/${reviewCardId}`
      );

      return response.data;
    } catch (error) {
      console.error('질문 목록 조회 실패:', error);
      throw new Error('질문 목록을 불러오는데 실패했습니다.');
    }
  }
}
