import apiClient from './apiClient';
import type { ApiResponse } from '../types/api';
import { API_ENDPOINTS } from '../constants/api';

// Request Types
export interface CodeAnalysisRequest {
  language: string;
  code: string;
}

// Response Types
export interface LogicalUnit {
  unitName: string;
  description: string;
  specificSteps: string[];
  code: string;
}

export interface CodeAnalysisResponse {
  logicalUnits: LogicalUnit[];
}

export type CodeAnalysisApiResponse = ApiResponse<CodeAnalysisResponse>;

/**
 * Analyzes algorithm code and extracts logical flow.
 * Sends user code and language to backend for AI analysis.
 */
export async function analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
  // Client-side validation
  if (!request.code?.trim()) {
    throw new Error('코드를 입력해주세요.');
  }

  if (!request.language?.trim()) {
    throw new Error('프로그래밍 언어를 선택해주세요.');
  }

  const response = await apiClient.post<CodeAnalysisResponse>(
    API_ENDPOINTS.PROBLEMS.CODE_ANALYZE,
    request
  );

  return response.data;
}

/**
 * Validates code analysis request data client-side.
 */
export function validateCodeAnalysisRequest(data: CodeAnalysisRequest): {
  isValid: boolean;
  error?: string
} {
  if (!data.code?.trim()) {
    return { isValid: false, error: '코드를 입력해주세요.' };
  }

  if (!data.language?.trim()) {
    return { isValid: false, error: '프로그래밍 언어를 선택해주세요.' };
  }

  // Check for very short code that might be placeholder
  if (data.code.trim().length < 10) {
    return { isValid: false, error: '유효한 코드를 입력해주세요.' };
  }

  return { isValid: true };
}

// Export code analysis service object
export const codeAnalysisService = {
  analyzeCode,
  validateCodeAnalysisRequest,
};

/**
 * Custom hook for using code analysis service.
 */
export function useCodeAnalysisService() {
  return codeAnalysisService;
}