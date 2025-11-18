import apiClient from './apiClient';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ReviewQuestionInfo {
  reviewQuestionId: number;
  questionText: string;
}

export interface ChatSessionResponse {
  sessionId: string;
  taskType: string;
  taskField: string;
  userName: string;
  conversationHistory: ChatMessage[];
  sessionMode: string;
  tutorLevel: string;
  reviewCardId: number;
  reviewQuestions: ReviewQuestionInfo[];
}

export class ChatSessionService {
  static async getChatSessionByReviewCardId(reviewCardId: number): Promise<ChatSessionResponse> {
    try {
      const response = await apiClient.get<ChatSessionResponse>(`/chat/session/review-card/${reviewCardId}`);
      return response.data;
    } catch (error) {
      console.error('Chat session 조회 실패:', error);
      throw error;
    }
  }
}
