import { useState, useRef, useCallback } from 'react';
import { AudioUploadService } from '../../services/audioUploadService';
import { SpeechTranscriptionService } from '../../services/speechTranscriptionService';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isUploading: boolean;
  uploadedGcsPath: string | null;
  toggleRecording: () => void;
}

/**
 * 음성 녹음 및 GCS 업로드 로직을 관리하는 Custom Hook
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedGcsPath, setUploadedGcsPath] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * 녹음을 시작합니다.
   */
  const startRecording = useCallback(async () => {
    try {
      // 브라우저 지원 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showErrorToast('이 브라우저는 음성 녹음을 지원하지 않습니다');
        return;
      }

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // MediaRecorder 설정
      const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      // 오디오 청크 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 중지 시 업로드
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        // 스트림 정리
        stream.getTracks().forEach((track) => track.stop());

        // GCS 업로드
        await uploadAudio(audioBlob, mimeType);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      console.log('녹음 시작:', { mimeType });
    } catch (error) {
      console.error('녹음 시작 실패:', error);

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        showErrorToast('마이크 접근 권한이 거부되었습니다');
      } else {
        showErrorToast('녹음을 시작할 수 없습니다');
      }
    }
  }, []);

  /**
   * 녹음을 중지합니다.
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('녹음 중지');
    }
  }, [isRecording]);

  /**
   * 음성 파일을 GCS에 업로드하고 STT 분석을 수행합니다.
   */
  const uploadAudio = async (audioBlob: Blob, contentType: string) => {
    setIsUploading(true);

    try {
      const fileName = `recording-${Date.now()}.${contentType.includes('ogg') ? 'ogg' : 'webm'}`;

      console.log('업로드 시작:', {
        fileName,
        contentType,
        size: audioBlob.size,
      });

      const result = await AudioUploadService.uploadAudioAndGetPath(audioBlob, fileName, contentType);

      setUploadedGcsPath(result.gcsPath);

      console.log('업로드 완료:', {
        gcsPath: result.gcsPath,
        fileUrl: result.fileUrl,
        objectName: result.objectName,
      });

      showSuccessToast('음성 파일이 업로드되었습니다');

      // 업로드 완료 후 자동으로 STT 분석 실행
      try {
        await SpeechTranscriptionService.transcribeAudio(result.gcsPath);
        showSuccessToast('음성 인식이 완료되었습니다');
      } catch (sttError) {
        console.error('STT 분석 실패:', sttError);
        showErrorToast('음성 인식에 실패했습니다');
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      showErrorToast('업로드에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 녹음 시작/중지를 토글합니다.
   */
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isUploading,
    uploadedGcsPath,
    toggleRecording,
  };
}
