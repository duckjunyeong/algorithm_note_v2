import { z } from 'zod';

export const evaluationResultSchema = z.enum(['SUCCESS', 'FAILURE']);

export const aiModeSchema = z.enum(['beginner-tutor', 'advanced-tutor', 'prof-tutor']);

export const answerSchema = z.object({
  answerId: z.number(),
  questionId: z.number(),
  content: z.string(),
  evaluationResult: evaluationResultSchema,
  createdAt: z.string(),
  aiMode: aiModeSchema.optional(),
});

export const createAnswerRequestSchema = z.object({
  questionId: z.number(),
  content: z.string().min(1, '답변 내용은 필수입니다.'),
  evaluationResult: evaluationResultSchema,
  aiMode: aiModeSchema.optional(),
});

export const createAnswerResponseSchema = z.object({
  answerId: z.number(),
  message: z.string(),
});

export const getAnswersResponseSchema = z.array(answerSchema);

export type Answer = z.infer<typeof answerSchema>;
export type CreateAnswerRequest = z.infer<typeof createAnswerRequestSchema>;
export type CreateAnswerResponse = z.infer<typeof createAnswerResponseSchema>;
export type GetAnswersResponse = z.infer<typeof getAnswersResponseSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
