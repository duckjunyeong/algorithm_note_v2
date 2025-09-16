import apiClient from './apiClient';
import type { ProblemData, CodeData, AnalysisResult } from '../store/useIncorrectAnswerNoteStore';

export interface AnalysisUrlRequest {
  url: string;
  code: string;
  language: string;
}

export interface AnalysisManualRequest {
  problemData: ProblemData;
  code: string;
  language: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult[];
  message?: string;
}

export const analysisService = {
  async analyzeByUrl(request: AnalysisUrlRequest): Promise<AnalysisResponse> {
    try {
      const response = await apiClient.post<AnalysisResponse>('/analyze-url', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze problem by URL');
    }
  },

  async analyzeByManual(request: AnalysisManualRequest): Promise<AnalysisResponse> {
    try {
      const response = await apiClient.post<AnalysisResponse>('/analyze-manual', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze problem manually');
    }
  }
};