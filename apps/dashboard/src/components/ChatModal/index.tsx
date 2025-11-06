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
  taskType: 'concept' | 'memorization' | 'approach';
  taskField: string;
  scrapedInfo?: {
    confirmationKey: string;
    analysisResult: any; // 실제 데이터 타입에 맞게 조정하세요.
  };
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
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleTypingComplete,
    handleSaveNote
  } = useChatModal(props);

  const chatModalViewProps = {
    isOpen,
    onClose,
    onBackgroundClick: onBackgroundClick || onClose, // 기본값 설정
    title: title || "추가 태스크 생성", // 기본값 설정
    messages,
    inputValue,
    loading,
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleTypingComplete,
    handleSaveNote
  };

  return <ChatModalView {...chatModalViewProps} />;
};
