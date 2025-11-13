import { useState, useRef, useCallback } from 'react';
import { AudioUploadService } from '../../services/audioUploadService';
import { SpeechTranscriptionService } from '../../services/speechTranscriptionService';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isUploading: boolean;
  isTranscribing: boolean;
  uploadedGcsPath: string | null;
  error: string | null;
  toggleRecording: () => void;
}


export function useAudioRecorder(props?: UseAudioRecorderProps): UseAudioRecorderReturn {
  const { onTranscriptionComplete, onError } = props || {};
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadedGcsPath, setUploadedGcsPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const uploadAudio = useCallback(async (audioBlob: Blob, contentType: string) => {
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

      setIsUploading(false);
      setIsTranscribing(true);

      try {
        const transcriptionResult = await SpeechTranscriptionService.transcribeAudio(result.gcsPath);

        console.log('STT 완료:', transcriptionResult);

        onTranscriptionComplete?.(transcriptionResult.transcript || '');
      } catch (sttError) {
        console.error('STT 분석 실패:', sttError);
        const errorMsg = '음성 인식에 실패했습니다';
        setError(errorMsg);
        showErrorToast(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      const errorMsg = '업로드에 실패했습니다';
      setError(errorMsg);
      showErrorToast(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsUploading(false);
      setIsTranscribing(false);
    }
  }, [onTranscriptionComplete, onError]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = '이 브라우저는 음성 녹음을 지원하지 않습니다';
        setError(errorMsg);
        showErrorToast(errorMsg);
        onError?.(errorMsg);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        stream.getTracks().forEach((track) => track.stop());

        await uploadAudio(audioBlob, mimeType);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      console.log('녹음 시작:', { mimeType });
    } catch (error) {
      console.error('녹음 시작 실패:', error);

      let errorMsg = '녹음을 시작할 수 없습니다';
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        errorMsg = '마이크 접근 권한이 거부되었습니다';
      }

      setError(errorMsg);
      showErrorToast(errorMsg);
      onError?.(errorMsg);
    }
  }, [onError, uploadAudio]);

 
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('녹음 중지');
    }
  }, [isRecording]);

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
    isTranscribing,
    uploadedGcsPath,
    error,
    toggleRecording,
  };
}
