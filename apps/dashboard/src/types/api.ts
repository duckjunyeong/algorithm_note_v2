// Common API Response Types
export interface ApiResponse<T = any> {
  message: string;
  status: 'success' | 'error';
  data?: T;
}

// Error Types
export interface ApiError {
  message: string;
  status: string;
  statusCode: number;
}

// Configuration Types
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}