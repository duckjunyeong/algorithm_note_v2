import { z } from 'zod';

export type TaskType = 'concept' | 'memorization' | 'approach';

export const createAnswerRequestSchema = z.object({
  message: z.string().min(1, "학습하신 내용을 작성해주세요")
});

export const createAnswerResponseSchema = z.object({
  title: z.string(),
  questions: z.array(z.object({
    id: z.number(),
    text: z.string()
  }))
});

export type CreateAnswerRequest = z.infer<typeof createAnswerRequestSchema>;
export type CreateAnswerResponse = z.infer<typeof createAnswerResponseSchema>;
export type Question = z.infer<typeof createAnswerResponseSchema>['questions'][0];