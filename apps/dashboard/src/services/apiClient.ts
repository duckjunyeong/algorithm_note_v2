import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export function initializeApiClient(getToken: () => Promise<string | null>) {
  getTokenFn = getToken;
}

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get authentication token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth state when authentication fails
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      // Redirect to sign-in page
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default apiClient;