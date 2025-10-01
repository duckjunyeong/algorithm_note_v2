/**
 * Answer API 타입 정의
 */

/**
 * 답변 평가 결과
 */
export type EvaluationResult = 'SUCCESS' | 'FAILURE';

/**
 * 답변 인터페이스
 */
export interface Answer {
  answerId: number;
  questionId: number;
  content: string;
  evaluationResult: EvaluationResult;
  createdAt: string;
}

/**
 * 답변 생성 요청 인터페이스
 */
export interface CreateAnswerRequest {
  questionId: number;
  content: string;
  evaluationResult: EvaluationResult;
}

/**
 * 답변 생성 응답 인터페이스
 */
export interface CreateAnswerResponse {
  answerId: number;
  message: string;
}

/**
 * 답변 목록 조회 응답 인터페이스
 */
export interface GetAnswersResponse {
  answers: Answer[];
}
