import { z } from 'zod';


export const chatInitializeRequestSchema = z.object({
  taskType: z.enum(['concept', 'memorization', 'approach'], {
    errorMap: () => ({ message: '태스크 유형은 concept, memorization, approach 중 하나여야 합니다' })
  }),
  taskField: z.string().optional().nullable()
});


export const chatInitializeResponseSchema = z.object({
  sessionId: z.string().uuid({ message: '유효하지 않은 세션 ID 형식입니다' }),
  success: z.boolean(),
  message: z.string()
});

export const chatMessageRequestSchema = z.object({
  sessionId: z.string().uuid({ message: '유효하지 않은 세션 ID 형식입니다' }),
  message: z.string().min(1, '메시지 내용은 필수입니다')
});

export type ChatInitializeRequest = z.infer<typeof chatInitializeRequestSchema>;
export type ChatInitializeResponse = z.infer<typeof chatInitializeResponseSchema>;
export type ChatMessageRequest = z.infer<typeof chatMessageRequestSchema>;
