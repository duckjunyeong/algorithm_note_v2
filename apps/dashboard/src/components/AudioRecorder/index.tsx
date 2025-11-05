import { useAudioRecorder } from './useAudioRecorder';
import { AudioRecorderView } from './AudioRecorder.view';

interface AudioRecorderProps {
  onUploadComplete?: (gcsPath: string) => void;
}

/**
 * 음성 녹음 및 GCS 업로드 컴포넌트 (Container)
 */
export function AudioRecorder({ onUploadComplete }: AudioRecorderProps) {
  const { isRecording, isUploading, uploadedGcsPath, toggleRecording } = useAudioRecorder();

  // 업로드 완료 시 부모 컴포넌트에 알림 (optional)
  if (uploadedGcsPath && onUploadComplete) {
    onUploadComplete(uploadedGcsPath);
  }

  return (
    <AudioRecorderView
      isRecording={isRecording}
      isUploading={isUploading}
      onToggleRecording={toggleRecording}
    />
  );
}
