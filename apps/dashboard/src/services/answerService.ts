import apiClient from './apiClient';
import type {
  CreateAnswerRequest,
  CreateAnswerResponse,
  Answer
} from '../schemas/answer.schema';
import { createAnswerResponseSchema, getAnswersResponseSchema } from '../schemas/answer.schema';


export class AnswerService {

  static async createAnswer(data: CreateAnswerRequest): Promise<CreateAnswerResponse> {
    try {
      const response = await apiClient.post<CreateAnswerResponse>('/answers/create', data);

      const validatedData = createAnswerResponseSchema.parse(response.data);

      return validatedData;
    } catch (error) {
      console.error('답변 생성 실패:', error);
      throw new Error('답변 생성에 실패했습니다.');
    }
  }

  static async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    try {
      const response = await apiClient.get<Answer[]>(`/answers/question/${questionId}`);

      const validatedData = getAnswersResponseSchema.parse(response.data);

      return validatedData;
    } catch (error) {
      console.error('답변 목록 조회 실패:', error);
      throw new Error('답변 목록을 불러오는데 실패했습니다.');
    }
  }
}
