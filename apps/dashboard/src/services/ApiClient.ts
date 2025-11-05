import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_CONFIG, HTTP_HEADERS } from '../constants/api';
import { ERROR_MESSAGES } from '../constants/messages';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: API_CONFIG.HEADERS.CONTENT_TYPE,
  },
});

let getTokenFn: (() => Promise<string | null>) | null = null;

export function initializeApiClient(getToken: () => Promise<string | null>) {
  getTokenFn = getToken;
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers[HTTP_HEADERS.AUTHORIZATION] = `${HTTP_HEADERS.BEARER_PREFIX} ${token}`;
        }
      } catch (error) {
        console.warn(ERROR_MESSAGES.AUTH_TOKEN_FAILED, error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      //window.location.href = PATHS.SIGN_IN;
    }
    return Promise.reject(error);
  }
);

export default apiClient;