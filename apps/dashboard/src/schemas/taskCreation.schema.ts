import { z } from 'zod';

// Request schema for creating answer
export const createAnswerRequestSchema = z.object({
  content: z.string().min(1, "학습하신 내용을 작성해주세요")
});

// Response schema from server
export const createAnswerResponseSchema = z.object({
  title: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string()
  }))
});

// Inferred types
export type CreateAnswerRequest = z.infer<typeof createAnswerRequestSchema>;
export type CreateAnswerResponse = z.infer<typeof createAnswerResponseSchema>;
export type Question = z.infer<typeof createAnswerResponseSchema>['questions'][0];