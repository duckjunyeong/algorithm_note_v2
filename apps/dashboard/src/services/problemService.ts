import apiClient from './apiClient';
import type { ApiResponse } from '../types/api';
import { API_ENDPOINTS } from '../constants/api';

// API Response Types
export type ProblemApiResponse = ApiResponse;

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

// Create specialized problem API client with different base URL and timeout
const problemApiClient = apiClient.create({
  baseURL: 'http://localhost:8085/api/problems',
  timeout: 30000, // 30 seconds for scraping operations
});

/**
 * Registers a problem by URL scraping from Baekjoon.
 */
export async function registerFromUrl(request: ProblemUrlRequest): Promise<ProblemApiResponse> {
  const response = await problemApiClient.post<ProblemApiResponse>(
    API_ENDPOINTS.PROBLEMS.REGISTER_URL,
    request
  );
  return response.data;
}

/**
 * Registers a problem from manual input.
 */
export async function registerFromManualInput(request: ProblemManualRequest): Promise<ProblemApiResponse> {
  const response = await problemApiClient.post<ProblemApiResponse>(
    API_ENDPOINTS.PROBLEMS.REGISTER_MANUAL,
    request
  );
  return response.data;
}

/**
 * Saves the cached problem to permanent storage.
 */
export async function saveProblemFromCache(): Promise<ProblemApiResponse> {
  const response = await problemApiClient.post<ProblemApiResponse>(API_ENDPOINTS.PROBLEMS.SAVE);
  return response.data;
}

/**
 * Clears temporary problem data for the current user.
 * This method is designed to fail gracefully - it won't throw errors
 * even if the API call fails, to ensure user experience is not disrupted.
 */
export async function clearTemporaryData(): Promise<void> {
  try {
    await problemApiClient.delete(API_ENDPOINTS.PROBLEMS.CLEANUP, {
      timeout: 5000, // 5 second timeout
    });
    console.log('임시 데이터 정리 성공');
  } catch (error) {
    // Graceful failure - log the error but don't throw
    console.warn('임시 데이터 정리 실패 (무시됨):', error);
    // 사용자 경험을 방해하지 않기 위해 예외를 throw하지 않습니다
  }
}

/**
 * Validates URL format client-side before sending to server.
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
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
export function validateManualInput(data: ProblemManualRequest): { isValid: boolean; errors: Record<string, string> } {
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

// Export problem service object for backward compatibility
export const problemService = {
  registerFromUrl,
  registerFromManualInput,
  saveProblemFromCache,
  clearTemporaryData,
  validateUrl,
  validateManualInput,
};

/**
 * Custom hook for using problem service.
 * No longer needs authentication setup as it's handled globally.
 */
export function useProblemService() {
  return problemService;
}