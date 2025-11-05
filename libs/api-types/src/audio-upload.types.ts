/**
 * Audio Upload API Types
 * Google Cloud Storage 음성 파일 업로드 관련 타입 정의
 */

export interface SignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface SignedUrlResponse {
  signedUrl: string;      // 업로드용 Signed URL (15분 만료)
  objectName: string;      // GCS 객체명
  gcsPath: string;         // gs://bucket/path (STT 분석용)
  fileUrl: string;         // https://storage.googleapis.com/... (다운로드용)
  expiresAt: string;       // Signed URL 만료 시간
}
