import React from 'react';
import { ChatModalView } from './ChatModal.view';
import { useChatModal } from './useChatModal';
import 'react-toastify/dist/ReactToastify.css';

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
  onNext?: () => void;
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
    connectionState,
    sessionId,
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    showGenerateButton,
    showNextButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleGenerateQuestions,
    handleSelectItems,
    handleRetry,
    onNext,
    audioRecorder,
    extractQuestionNumber
  } = useChatModal(props);

  const handleSaveNote = () => {
    console.log('저장 버튼 클릭됨');
  };

  const chatModalViewProps = {
    isOpen,
    onClose,
    onBackgroundClick: onBackgroundClick || onClose,
    title: title || "추가 태스크 생성",
    mode: props.mode,
    messages,
    inputValue,
    loading,
    initLoading,
    connectionState,
    sessionId,
    chatAreaRef,
    recommendedQuestions,
    showSaveButton,
    showGenerateButton,
    showNextButton,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleSaveNote,
    handleGenerateQuestions,
    handleSelectItems,
    handleRetry,
    onNext,
    audioRecorder,
    extractQuestionNumber
  };

  return <ChatModalView {...chatModalViewProps} />;
};
