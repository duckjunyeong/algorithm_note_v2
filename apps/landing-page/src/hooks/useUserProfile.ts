import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../services/userService';
import type { UpdateUserProfileRequest } from '../schemas/user.schema';

/**
 * Query keys for user-related data
 */
export const userQueryKeys = {
  profile: ['user', 'profile'] as const,
  stats: ['user', 'stats'] as const,
};

/**
 * Hook to fetch and manage user profile data
 */
export function useUserProfile() {
  const queryClient = useQueryClient();

  // Query for user profile
  const profileQuery = useQuery({
    queryKey: userQueryKeys.profile,
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(userQueryKeys.profile, updatedProfile);
    },
  });

  return {
    // Profile data
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // Update profile function
    updateProfile: (data: UpdateUserProfileRequest) => updateProfileMutation.mutate(data),
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,

    // Utility functions
    refetch: profileQuery.refetch,
  };
}