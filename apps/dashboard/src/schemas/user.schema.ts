import { z } from 'zod';

// User profile response schema
export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('en'),
    notifications: z.boolean().default(true),
  }).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// User profile update request schema
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

// Infer TypeScript types from schemas
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileSchema>;