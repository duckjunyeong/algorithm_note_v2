import apiClient from './apiClient';
import {
  createAnswerRequestSchema,
  createAnswerResponseSchema,
  type CreateAnswerRequest,
  type CreateAnswerResponse
} from '../schemas/taskCreation.schema';

export class TaskCreationService {
  async createAnswer(message: string): Promise<CreateAnswerResponse> {
    const requestData: CreateAnswerRequest = { message };

    // Validate request data
    const validatedRequest = createAnswerRequestSchema.parse(requestData);

    try {
      const response = await apiClient.post('/answer/create', validatedRequest);
      console.log('Raw API Response:', response.data.aiResponse);

      // Validate response data
      return createAnswerResponseSchema.parse(response.data.aiResponse);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`질문 생성 요청 실패: ${error.message}`);
      }
      throw new Error('질문 생성 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}

export const taskCreationService = new TaskCreationService();