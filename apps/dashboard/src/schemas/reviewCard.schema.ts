import { z } from 'zod';

/**
 * 복습 카드 관련 Zod 검증 스키마 정의
 */

// 복습 질문 스키마
export const reviewQuestionSchema = z.object({
  text: z.string()
    .min(1, "질문 내용을 입력해주세요")
    .max(500, "질문은 500자 이내로 작성해주세요")
});

// 복습 카드 생성 요청 스키마
export const createReviewCardRequestSchema = z.object({
  title: z.string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자 이내로 작성해주세요"),

  categoryId: z.number()
    .int("카테고리 ID는 정수여야 합니다")
    .positive("카테고리를 선택해주세요"),

  importance: z.number()
    .int("중요도는 정수여야 합니다")
    .min(1, "중요도는 1 이상이어야 합니다")
    .max(5, "중요도는 5 이하여야 합니다"),

  reviewCycle: z.number()
    .int("반복 주기는 정수여야 합니다")
    .min(1, "반복 주기는 1일 이상이어야 합니다")
    .max(365, "반복 주기는 365일 이하여야 합니다"),

  questions: z.array(reviewQuestionSchema)
    .min(1, "최소 1개의 질문을 추가해주세요")
    .max(10, "질문은 최대 10개까지 추가할 수 있습니다")
});

// 복습 카드 생성 응답 스키마
export const createReviewCardResponseSchema = z.object({
  reviewCardId: z.number().int().positive(),
  message: z.string()
});

// 복습 카드 스키마
export const reviewCardSchema = z.object({
  reviewCardId: z.number().int().positive(),
  title: z.string(),
  category: z.string(),
  importance: z.number().int().min(1).max(5),
  reviewCycle: z.number().int().positive(),
  isActive: z.boolean(),
  reviewCount: z.number().int().min(0),
  successCount: z.number().int().min(0),
  failCount: z.number().int().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// 복습 카드 목록 조회 응답 스키마
export const getReviewCardsResponseSchema = z.array(reviewCardSchema);

// 복습 카드 상태 업데이트 요청 스키마
export const updateReviewCardStatusRequestSchema = z.object({
  isActive: z.boolean()
});

// API 에러 응답 스키마
export const apiErrorResponseSchema = z.object({
  status: z.number().int(),
  message: z.string(),
  timestamp: z.string().optional()
});

// 타입 추론
export type CreateReviewCardRequest = z.infer<typeof createReviewCardRequestSchema>;
export type CreateReviewCardResponse = z.infer<typeof createReviewCardResponseSchema>;
export type ReviewCard = z.infer<typeof reviewCardSchema>;
export type GetReviewCardsResponse = z.infer<typeof getReviewCardsResponseSchema>;
export type UpdateReviewCardStatusRequest = z.infer<typeof updateReviewCardStatusRequestSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type ReviewQuestion = z.infer<typeof reviewQuestionSchema>;