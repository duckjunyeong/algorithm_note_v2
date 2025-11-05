import type { TranscribeAudioRequest, TranscribeAudioResponse } from '../../../../libs/api-types/src';
import apiClient from './apiClient';

export class SpeechTranscriptionService {

  static async transcribeAudio(gcsPath: string): Promise<TranscribeAudioResponse> {
    try {
      console.log('=== STT 분석 시작 ===');
      console.log('GCS 경로:', gcsPath);

      const request: TranscribeAudioRequest = {
        gcsPath,
      };

      const response = await apiClient.post<TranscribeAudioResponse>('/speech/transcribe', request);

      console.log('=== STT 분석 결과 ===');
      console.log('인식된 텍스트:', response.data.transcript);
      console.log('신뢰도:', response.data.confidence);
      console.log('언어:', response.data.languageCode);

      return response.data;
    } catch (error) {
      console.error('=== STT 분석 실패 ===');
      console.error('GCS 경로:', gcsPath);
      console.error('에러:', error);
      throw error;
    }
  }
}
