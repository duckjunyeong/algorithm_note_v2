import { z } from 'zod';


export const categorySchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const createCategoryRequestSchema = z.object({
  name: z.string()
    .min(1, "카테고리 이름을 입력해주세요")
    .max(100, "카테고리 이름은 100자 이내로 작성해주세요"),

  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "유효한 색상 코드를 입력해주세요 (예: #3B82F6)")
});

export const getCategoriesResponseSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;
export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;
