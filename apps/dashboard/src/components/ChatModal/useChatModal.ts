import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../services/apiClient';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

const initialBotMessage: Message = {
  id: 1,
  sender: 'bot',
  text: `안녕하세요! 오늘 어떤 도움이 필요하신가요?`,
  isTyping: false
};

const recommendedQuestions = [
    "안녕하세요! 태스크 계획을 세우고 싶습니다.",
    "특정 기능 구현",
    "기술적 기반 구축(인프라, 보안 등)"
];

interface ScrapedInfo {
  confirmationKey: string;
  analysisResult: any; // 실제 데이터 타입에 맞게 조정하세요.
}

interface UseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  title?: string;
  taskType: 'concept' | 'memorization' | 'approach';
  taskField: string;
  scrapedInfo?: ScrapedInfo;
}

export const useChatModal = ({
  isOpen,
  onClose,
  onBackgroundClick = () => {},
  title = "추가 태스크 생성",
  taskType,
  taskField,
  scrapedInfo
}: UseChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (loading) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initiateNoteCreation();
    }
  }, [isOpen]); // messages.length를 의존성 배열에서 제거하여 무한 루프 방지

  const initiateNoteCreation = async () => {
    setLoading(true);
    try {
      if (!scrapedInfo) {
        // For task creation without scraped info, use initial bot message
        setMessages([initialBotMessage]);
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/api/notes/initiate', {
        key: scrapedInfo.confirmationKey,
        analysisResult: scrapedInfo.analysisResult
      });

      const botMessage = {
        id: Date.now(),
        sender: 'bot',
        text: response.data,
        isTyping: true
      };
      setMessages([botMessage]);
    } catch (error) {
      console.error('Failed to initiate note creation:', error);
      setMessages([initialBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = (typeof messageText === 'string' ? messageText : inputValue).trim();
    if (textToSend === '') return;

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    if (typeof messageText !== 'string') setInputValue('');
    setLoading(true);

    // 사용자 메시지 추가 후 스크롤
    setTimeout(scrollToBottom, 10);

    try {
      if (!scrapedInfo) {
        // For task creation without scraped info, show a placeholder response
        const botResponse: Message = {
          id: Date.now() + 1,
          sender: 'bot',
          text: '태스크 생성 기능은 현재 개발 중입니다. API 연결이 필요합니다.',
          isTyping: true,
        };
        setMessages(prev => [...prev, botResponse]);
        setTimeout(scrollToBottom, 10);
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/api/notes/chat', {
        sessionId: scrapedInfo.confirmationKey,
        message: textToSend
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

      // AI 응답 추가 후 스크롤
      setTimeout(scrollToBottom, 10);
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
  }, [inputValue, scrollToBottom, scrapedInfo]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleRecommendationClick = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleTypingComplete = useCallback((messageId: number, messageIndex: number) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isTyping: false } : m
    ));
    // 현재 메시지가 마지막 메시지일 때만 로딩 상태를 해제합니다.
    // 이는 여러 메시지가 순차적으로 오는 경우 이전 메시지의 타이핑 완료가 로딩을 끄지 않도록 합니다.
    // 하지만, 최종 응답 후 `loading`이 `false`로 설정되는 로직이 `handleSendMessage`에 이미 있으므로
    // 이 조건은 필요 없을 수도 있습니다. 상황에 따라 조정하세요.
    // if (messageIndex === messages.length - 1) {
    //   setLoading(false);
    // }
    
    // 타이핑 완료 후 스크롤
    setTimeout(scrollToBottom, 50);
  }, [scrollToBottom]);

  const handleSaveNote = useCallback(async () => {
    setLoading(true);
    try {
      if (!scrapedInfo) {
        toast.error('세션 정보가 없습니다. API 연결이 필요합니다.');
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/api/notes/save-final-note', {
        sessionId: scrapedInfo.confirmationKey
      });

      if (response.data.success) {
        toast.success(`${response.data.finalNoteCount}개의 오답카드가 생성되었습니다.`);
        onClose();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('노트 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }, [scrapedInfo, onClose]);

  return {
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
  };
};