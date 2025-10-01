import apiClient from './apiClient';
import type {
  CreateAnswerRequest,
  CreateAnswerResponse,
  Answer
} from '../schemas/answer.schema';
import { createAnswerResponseSchema, getAnswersResponseSchema } from '../schemas/answer.schema';

/**
 * Answer 관련 API 호출 서비스
 */
export class AnswerService {
  /**
   * 답변 생성
   * @param data 답변 생성 요청 데이터
   * @returns 생성된 답변 정보
   */
  static async createAnswer(data: CreateAnswerRequest): Promise<CreateAnswerResponse> {
    try {
      const response = await apiClient.post<CreateAnswerResponse>('/answers/create', data);

      // Zod 스키마로 응답 검증
      const validatedData = createAnswerResponseSchema.parse(response.data);

      return validatedData;
    } catch (error) {
      console.error('답변 생성 실패:', error);
      throw new Error('답변 생성에 실패했습니다.');
    }
  }

  /**
   * 특정 질문에 대한 답변 목록 조회
   * @param questionId 질문 ID
   * @returns 답변 목록 (최신순)
   */
  static async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    try {
      const response = await apiClient.get<Answer[]>(`/answers/question/${questionId}`);

      // Zod 스키마로 응답 검증
      const validatedData = getAnswersResponseSchema.parse(response.data);

      return validatedData;
    } catch (error) {
      console.error('답변 목록 조회 실패:', error);
      throw new Error('답변 목록을 불러오는데 실패했습니다.');
    }
  }
}
