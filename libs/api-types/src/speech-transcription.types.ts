/**
 * Speech Transcription API Types
 * Google Cloud Speech-to-Text 음성 인식 관련 타입 정의
 */

export interface TranscribeAudioRequest {
  gcsPath: string;
}

export interface TranscribeAudioResponse {
  transcript: string;      // 음성을 텍스트로 변환한 결과
  confidence: number;      // 신뢰도 점수 (0.0 ~ 1.0)
  languageCode: string;    // 인식된 언어 코드 ("ko-KR")
}
