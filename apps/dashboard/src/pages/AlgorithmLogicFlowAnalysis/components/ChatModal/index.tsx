// src/components/ChatModal/index.tsx
import React from 'react';
import { useChatModal } from './UseChatModal'
import { ChatModalView } from './ChatModal.view';

interface AnalysisStep {
  id: string;
  title: string;
  code: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  title?: string;
  scrapedInfo?: { confirmationKey?: string; confirmKey?: string };
  block?: { id?: string | number };
  selectedStep?: AnalysisStep | null;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onBackgroundClick,
  title = "추가 태스크 생성",
  scrapedInfo,
  block,
  selectedStep
}) => {
  const {
    messages,
    inputValue,
    loading,
    showSaveButton,
    recommendedQuestions,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleRecommendationClick,
    handleTypingComplete,
    handleSaveNote
  } = useChatModal({ isOpen, scrapedInfo, block, selectedStep });

  return (
    <ChatModalView
      isOpen={isOpen}
      onClose={onClose}
      onBackgroundClick={onBackgroundClick}
      title={title}
      messages={messages}
      inputValue={inputValue}
      loading={loading}
      recommendedQuestions={recommendedQuestions}
      showSaveButton={showSaveButton}
      setInputValue={setInputValue}
      handleSendMessage={handleSendMessage}
      handleKeyDown={handleKeyDown}
      handleRecommendationClick={handleRecommendationClick}
      handleTypingComplete={handleTypingComplete}
      handleSaveNote={() => handleSaveNote(onClose)}
    />
  );
};

export default ChatModal;