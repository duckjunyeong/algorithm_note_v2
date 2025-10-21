/**
 * 복습 카드 API 타입 정의
 */

// 복습 카드 기본 인터페이스
export interface ReviewCard {
  reviewCardId: number;
  title: string;
  category: string;
  categoryId?: number;
  importance: number;
  reviewCycle: number;
  isActive: boolean;
  reviewCount: number;
  successRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 복습 질문 인터페이스
export interface ReviewQuestion {
  reviewQuestionId: number;
  reviewCardId: number;
  questionText: string;
  successCount: number;
  failCount: number;
  createdAt?: string;
}

// 복습 카드 생성 요청 인터페이스
export interface CreateReviewCardRequest {
  title: string;
  categoryId: number;
  importance: number;
  reviewCycle: number;
  questions: Array<{
    text: string;
  }>;
}

// 복습 카드 생성 응답 인터페이스
export interface CreateReviewCardResponse {
  reviewCardId: number;
  message: string;
}

// 복습 카드 목록 조회 응답 인터페이스
export interface GetReviewCardsResponse {
  reviewCards: ReviewCard[];
}

// 복습 결과 업데이트 요청 인터페이스
export interface UpdateReviewResultRequest {
  title?: string;
  categoryId?: number;
  importance?: number;
  reviewCycle?: number;
  isActive: boolean;
  deletedQuestionIds: number[];
  questionUpdates: Array<{
    reviewQuestionId: number;
    successCount: number;
    failCount: number;
  }>;
}

// 답변 인터페이스
export interface Answer {
  answerId: number;
  questionId: number;
  content: string;
  evaluationResult: 'SUCCESS' | 'FAILURE';
  createdAt: string;
}

// 질문과 답변 목록 인터페이스
export interface QuestionWithAnswers {
  reviewQuestionId: number;
  questionText: string;
  answers: Answer[];
}

// 복습 카드 결과 조회 응답 인터페이스
export interface ReviewCardResultResponse {
  questions: QuestionWithAnswers[];
}

// API 에러 응답 인터페이스
export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp?: string;
}