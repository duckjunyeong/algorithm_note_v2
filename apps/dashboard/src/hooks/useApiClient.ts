import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { initializeApiClient } from '../services/apiClient';

export function useApiClient() {
  const { getToken } = useAuth();

  useEffect(() => {
    initializeApiClient(getToken);
  }, [getToken]);
}