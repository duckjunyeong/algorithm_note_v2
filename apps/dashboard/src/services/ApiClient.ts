import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiError, ApiClientConfig } from '../types/api';

export class ApiClient {
  protected axiosInstance: AxiosInstance;
  private isAuthInterceptorSet = false;

  constructor(config: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  }

  /**
   * Sets up JWT token interceptor for authentication.
   * This should be called from a component that has access to authentication.
   */
  public setupAuthInterceptor(getToken: () => Promise<string | null>) {
    // Prevent duplicate interceptor setup
    if (this.isAuthInterceptorSet) {
      return;
    }

    // Request interceptor to add JWT token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Failed to get auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.transformError(error);
        return Promise.reject(apiError);
      }
    );

    this.isAuthInterceptorSet = true;
  }

  /**
   * Transforms axios errors into a consistent API error format.
   */
  protected transformError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any;
      return {
        message: responseData?.message || 'An error occurred',
        status: responseData?.status || 'error',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // Network error or no response
      return {
        message: 'Network error. Please check your connection and try again.',
        status: 'error',
        statusCode: 0,
      };
    } else {
      // Request setup error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 'error',
        statusCode: -1,
      };
    }
  }

  /**
   * Gets the underlying axios instance for advanced usage.
   */
  protected getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}