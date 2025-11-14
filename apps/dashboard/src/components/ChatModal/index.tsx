import React from 'react';
import { ChatModalView } from './ChatModal.view';
import { useChatModal } from './useChatModal';
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS 임포트

// Props 인터페이스 정의
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  title?: string;
  mode: 'question-generation' | 'review-test';
  taskType: 'concept' | 'memorization' | 'approach';
  taskField: string;
  tutorLevel?: string;
  reviewCardId?: number;
  scrapedInfo?: {
    confirmationKey: string;
    analysisResult: any;
  };
  onQuestionsGenerated?: () => void;
  onTestCompleted?: (result: any) => void;
}

export const ChatModal: React.FC<ChatModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    onBackgroundClick,
    title,
    messages,
    inputValue,
    loading,
    initLoading,
    sessionId,
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    showGenerateButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleGenerateQuestions,
    handleSelectItems,
    audioRecorder
  } = useChatModal(props);

  // 임시 handleSaveNote 함수 (추후 구현 예정)
  const handleSaveNote = () => {
    console.log('저장 버튼 클릭됨');
  };

  const chatModalViewProps = {
    isOpen,
    onClose,
    onBackgroundClick: onBackgroundClick || onClose, // 기본값 설정
    title: title || "추가 태스크 생성", // 기본값 설정
    mode: props.mode,
    messages,
    inputValue,
    loading,
    initLoading,
    sessionId,
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    showGenerateButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleSaveNote,
    handleGenerateQuestions,
    handleSelectItems,
    audioRecorder
  };

  return <ChatModalView {...chatModalViewProps} />;
};
