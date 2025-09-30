/**
 * 복습 카드 API 타입 정의
 */

// 복습 카드 기본 인터페이스
export interface ReviewCard {
  reviewCardId: number;
  title: string;
  category: string;
  importance: number;
  reviewCycle: number;
  isActive: boolean;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// 복습 질문 인터페이스
export interface ReviewQuestion {
  reviewQuestionId: number;
  reviewCardId: number;
  questionText: string;
  createdAt?: string;
}

// 복습 카드 생성 요청 인터페이스
export interface CreateReviewCardRequest {
  title: string;
  category: string;
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

// API 에러 응답 인터페이스
export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp?: string;
}