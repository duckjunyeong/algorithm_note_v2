import apiClient from './apiClient';
import { userProfileSchema, updateUserProfileSchema } from '../schemas/user.schema';
import type { UserProfile, UpdateUserProfileRequest } from '../schemas/user.schema';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Get current user's profile information
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
  return userProfileSchema.parse(response.data);
}

/**
 * Update current user's profile information
 */
export async function updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
  // Validate request data
  const validatedData = updateUserProfileSchema.parse(data);

  const response = await apiClient.put(API_ENDPOINTS.USERS.PROFILE, validatedData);
  return userProfileSchema.parse(response.data);
}

/**
 * Delete current user's account
 */
export async function deleteUserAccount(): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.USERS.PROFILE);
}

/**
 * Get user's activity statistics
 */
export async function getUserStats(): Promise<{
  problemsSolved: number;
  weeklyActivity: number[];
  streakDays: number;
  totalTimeSpent: number;
}> {
  const response = await apiClient.get(API_ENDPOINTS.USERS.STATS);
  return response.data;
}