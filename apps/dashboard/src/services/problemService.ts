import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ApiClient } from './ApiClient';
import type { ApiResponse } from '../types/api';

// API Response Types
export interface ProblemApiResponse extends ApiResponse {}

// Request Types
export interface ProblemUrlRequest {
  url: string;
}

export interface ProblemManualRequest {
  title: string;
  description: string;
  inputCondition: string;
  outputCondition: string;
  constraints?: string;
}

class ProblemService extends ApiClient {
  constructor() {
    super({
      baseURL: 'http://localhost:8085/api/problems',
      timeout: 30000, // 30 seconds for scraping operations
    });
  }

  /**
   * Registers a problem by URL scraping from Baekjoon.
   */
  public async registerFromUrl(request: ProblemUrlRequest): Promise<ProblemApiResponse> {
    try {
      const response = await this.axiosInstance.post<ProblemApiResponse>(
        '/register/url',
        request
      );
      return response.data;
    } catch (error) {
      throw error; // Re-throw as it's already transformed by interceptor
    }
  }

  /**
   * Registers a problem from manual input.
   */
  public async registerFromManualInput(request: ProblemManualRequest): Promise<ProblemApiResponse> {
    try {
      const response = await this.axiosInstance.post<ProblemApiResponse>(
        '/register/manual',
        request
      );
      return response.data;
    } catch (error) {
      throw error; // Re-throw as it's already transformed by interceptor
    }
  }

  /**
   * Saves the cached problem to permanent storage.
   */
  public async saveProblemFromCache(): Promise<ProblemApiResponse> {
    try {
      const response = await this.axiosInstance.post<ProblemApiResponse>('/save');
      return response.data;
    } catch (error) {
      throw error; // Re-throw as it's already transformed by interceptor
    }
  }

  /**
   * Validates URL format client-side before sending to server.
   */
  public validateUrl(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) {
      return { isValid: false, error: '문제 링크(URL)를 입력하세요.' };
    }

    const urlPattern = /^https:\/\/www\.acmicpc\.net\/problem\/\d+$/;
    if (!urlPattern.test(url.trim())) {
      return {
        isValid: false,
        error: 'URL 형식이 올바르지 않습니다. (예: https://www.acmicpc.net/problem/1000)',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates manual input data client-side.
   */
  public validateManualInput(data: ProblemManualRequest): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) {
      errors.title = '문제 제목을 입력하세요.';
    }

    if (!data.description?.trim()) {
      errors.description = '문제 설명을 입력하세요.';
    }

    if (!data.inputCondition?.trim()) {
      errors.inputCondition = '입력 조건을 입력하세요.';
    }

    if (!data.outputCondition?.trim()) {
      errors.outputCondition = '출력 조건을 입력하세요.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const problemService = new ProblemService();

/**
 * Custom hook for using problem service with authentication.
 * This hook sets up the auth interceptor when the component mounts.
 */
export function useProblemService() {
  const { getToken } = useAuth();

  // Setup auth interceptor on first render
  React.useEffect(() => {
    problemService.setupAuthInterceptor(getToken);
  }, [getToken]);

  return problemService;
}