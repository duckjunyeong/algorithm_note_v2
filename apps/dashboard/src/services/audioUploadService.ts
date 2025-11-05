import axios from 'axios';
import type { SignedUrlRequest, SignedUrlResponse } from '../../../../libs/api-types/src';
import apiClient from './apiClient';

export class AudioUploadService {

  static async getSignedUrl(fileName: string, contentType: string): Promise<SignedUrlResponse> {
    try {
      const request: SignedUrlRequest = {
        fileName,
        contentType,
      };

      const response = await apiClient.post<SignedUrlResponse>('/signed-url', request);

      console.log('Signed URL 발급 성공:', {
        objectName: response.data.objectName,
        gcsPath: response.data.gcsPath,
        expiresAt: response.data.expiresAt,
      });

      return response.data;
    } catch (error) {
      console.error('Signed URL 요청 실패:', error);
      throw error;
    }
  }


  static async uploadToGCS(signedUrl: string, audioBlob: Blob, contentType: string): Promise<void> {
    try {
      console.log('GCS 업로드 시작:', {
        signedUrl: signedUrl.substring(0, 100) + '...',
        blobSize: audioBlob.size,
        contentType,
      });

      await axios.put(signedUrl, audioBlob, {
        headers: {
          'Content-Type': contentType,
        },
      });

      console.log('GCS 업로드 완료');
    } catch (error) {
      console.error('GCS 업로드 실패:', error);
      throw error;
    }
  }

  static async uploadAudioAndGetPath(
    audioBlob: Blob,
    fileName: string,
    contentType: string
  ): Promise<{ gcsPath: string; fileUrl: string; objectName: string }> {
    try {
      const signedUrlResponse = await this.getSignedUrl(fileName, contentType);

      await this.uploadToGCS(signedUrlResponse.signedUrl, audioBlob, contentType);

      return {
        gcsPath: signedUrlResponse.gcsPath,
        fileUrl: signedUrlResponse.fileUrl,
        objectName: signedUrlResponse.objectName,
      };
    } catch (error) {
      console.error('음성 파일 업로드 및 경로 획득 실패:', error);
      throw error;
    }
  }
}
