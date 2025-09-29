// src/components/ChatModal/useChatModal.ts
import { useState, useRef, useEffect } from 'react';
import apiClient from '../../../../services/apiClient';

export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

interface AnalysisStep {
  id: string;
  title: string;
  description?: string;
  code: string;
}

interface UseChatModalProps {
  isOpen: boolean;
  scrapedInfo?: { confirmationKey?: string; confirmKey?: string };
  block?: { id?: string | number };
  selectedStep?: AnalysisStep | null;
  chatSessionKey?: string;
}

const recommendedQuestions = [
  "안녕하세요! 태스크 계획을 세우고 싶습니다.",
  "특정 기능 구현",
  "기술적 기반 구축(인프라, 보안 등)"
];

export const useChatModal = ({ isOpen, scrapedInfo, block, selectedStep, chatSessionKey }: UseChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    if (isOpen && chatSessionKey) {
      // 메시지 초기화 후 새로운 채팅 시작
      setMessages([]);
      setLoading(false);
      setShowSaveButton(false);
      setInputValue('');

      if (selectedStep) {
        initiateNoteCreation();
      } else if (block?.id) {
        // 기존 block 로직 유지
      }
    }
  }, [isOpen, chatSessionKey, selectedStep, block]);

  

  const initiateNoteCreation = async () => {
    setLoading(true);
    try {
      // apiClient 사용
      const response = await apiClient.post('/problems/chat', {
        messages: null,

        logicalUnit: {
          unitName: selectedStep?.title,
          description: selectedStep?.description,
          specificSteps: [], 
          code: selectedStep?.code
        }
      });

      const botMessage: Message = {
        id: Date.now(),
        sender: 'bot',
        text: response.data.aiResponse,
        isTyping: true
      };
      setMessages([botMessage]);
    } catch (error) {
      console.error('Failed to initiate note creation:', error);
      const initialBotMessage: Message = {
        id: 1,
        sender: 'bot',
        text: `안녕하세요! 오늘 어떤 도움이 필요하신가요?`,
        isTyping: false
      };
      setMessages([initialBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = (typeof messageText === 'string' ? messageText : inputValue).trim();
    if (!textToSend) return;

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    if (typeof messageText !== 'string') setInputValue('');
    setLoading(true);

    try {
      const sessionId = scrapedInfo?.confirmKey || scrapedInfo?.confirmationKey;
      // apiClient 사용
      const response = await apiClient.post('/api/notes/chat', {
        sessionId,
        message: textToSend,
        blockId: null
      });

      if (response.data.finalResponse) {
        setShowSaveButton(true);
      }

      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.data.aiResponse,
        isTyping: true,
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '죄송합니다. 메시지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
        isTyping: true,
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleTypingComplete = (messageId: number) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, isTyping: false } : m
    ));
  };

  const handleSaveNote = async (onClose: () => void) => {
    setLoading(true);
    try {
      const sessionId = scrapedInfo?.confirmKey || scrapedInfo?.confirmationKey;
      // apiClient 사용
      const response = await apiClient.post('/api/notes/save-final-note', {
        sessionId
      });

      if (response.data) { // 응답 데이터 구조에 맞게 조건 확인
        onClose();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    loading,
    showSaveButton,
    recommendedQuestions,
    setInputValue,
    handleSendMessage,
    handleKeyDown,
    handleTypingComplete,
    handleSaveNote
  };
};