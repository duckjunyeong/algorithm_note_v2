import { z } from 'zod';

/**
 * 답변 평가 결과 스키마
 */
export const evaluationResultSchema = z.enum(['SUCCESS', 'FAILURE']);

/**
 * 답변 스키마
 */
export const answerSchema = z.object({
  answerId: z.number(),
  questionId: z.number(),
  content: z.string(),
  evaluationResult: evaluationResultSchema,
  createdAt: z.string(),
});

/**
 * 답변 생성 요청 스키마
 */
export const createAnswerRequestSchema = z.object({
  questionId: z.number(),
  content: z.string().min(1, '답변 내용은 필수입니다.'),
  evaluationResult: evaluationResultSchema,
});

/**
 * 답변 생성 응답 스키마
 */
export const createAnswerResponseSchema = z.object({
  answerId: z.number(),
  message: z.string(),
});

/**
 * 답변 목록 조회 응답 스키마
 */
export const getAnswersResponseSchema = z.array(answerSchema);

/**
 * TypeScript 타입 추론
 */
export type Answer = z.infer<typeof answerSchema>;
export type CreateAnswerRequest = z.infer<typeof createAnswerRequestSchema>;
export type CreateAnswerResponse = z.infer<typeof createAnswerResponseSchema>;
export type GetAnswersResponse = z.infer<typeof getAnswersResponseSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
