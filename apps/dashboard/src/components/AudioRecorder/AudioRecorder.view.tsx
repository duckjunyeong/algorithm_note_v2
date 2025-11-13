import { Mic } from 'lucide-react';

interface AudioRecorderViewProps {
  isRecording: boolean;
  isUploading: boolean;
  onToggleRecording: () => void;
}

/**
 * 음성 녹음 버튼 컴포넌트 (Pure Presentation)
 */
export function AudioRecorderView({
  isRecording,
  isUploading,
  onToggleRecording,
}: AudioRecorderViewProps) {
  const getButtonText = () => {
    if (isUploading) return '업로드 중...';
    if (isRecording) return '중지하기';
    return '녹음하기';
  };

  const getButtonStyle = () => {
    if (isUploading) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (isRecording) {
      return 'bg-red-500 hover:bg-red-600 animate-pulse';
    }
    return 'bg-brand hover:bg-brand-dark';
  };

  return (
    <button
      onClick={onToggleRecording}
      disabled={isUploading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${getButtonStyle()}`}
      aria-label={getButtonText()}
    >
      <Mic size={16} />
      {getButtonText()}
    </button>
  );
}
