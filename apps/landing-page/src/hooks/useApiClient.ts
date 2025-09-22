import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { initializeApiClient } from '../services/apiClient';

/**
 * Hook to initialize the API client with Clerk authentication
 * Should be used at the root level of the authenticated app
 */
export function useApiClient() {
  const { getToken } = useAuth();

  useEffect(() => {
    // Initialize the API client with Clerk's getToken function
    initializeApiClient(getToken);
  }, [getToken]);

  return {
    isInitialized: true,
  };
}