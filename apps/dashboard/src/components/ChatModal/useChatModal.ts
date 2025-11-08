import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { chatService } from '../../services/chatService';
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
  text: `"안녕하세요. 젠틴 에너지 가득한 하루네요! 🚀\n\n함께 멋진 AI 기반 오답노트 & 복습 관리 서비스 태스크 계획을 세워봅시다!\n\n먼저, 현재 프로젝트 상황과 젠틴이 이전에 집중하고 싶은 목표가 무엇인지 알려주실 수 있을까요?\n\n예를 들어,\n* 특정 기능 구현\n* 기술 기반 구축\n* 리팩토링 및 개선\n* 기타(직접 알려주세요)\n\n어떤 부분에 집중하고 싶으신가요?"`,
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
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

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
      initializeChatSession();
    }
  }, [isOpen]); // messages.length를 의존성 배열에서 제거하여 무한 루프 방지

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const initializeChatSession = async () => {
    setInitLoading(true);
    try {
      // New flow: Initialize chat session with streaming
      const newSessionId = await chatService.initializeChatSession(
        taskType,
        taskField || null
      );

      setSessionId(newSessionId);

      const welcomeMessage: Message = {
        id: Date.now(),
        sender: 'bot',
        text: '안녕하세요! 학습하신 내용을 입력해주시면 맞춤 질문을 생성해드리겠습니다.',
        isTyping: false
      };
      setMessages([welcomeMessage]);
    } catch (error: any) {
      console.error('Failed to initialize chat session:', error);
      toast.error(error.message || '채팅 세션 초기화에 실패했습니다');
      setMessages([initialBotMessage]);
    } finally {
      setInitLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = (typeof messageText === 'string' ? messageText : inputValue).trim();
    if (textToSend === '') return;

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    if (typeof messageText !== 'string') setInputValue('');
    setLoading(true);

    setTimeout(scrollToBottom, 10);

    try {
      if (!sessionId) {
        throw new Error('세션 ID가 없습니다');
      }

      // Add empty bot message for streaming
      const botMessageId = Date.now() + 1;
      const botMessage: Message = {
        id: botMessageId,
        sender: 'bot',
        text: '',
        isTyping: true
      };
      setMessages(prev => [...prev, botMessage]);

      eventSourceRef.current = chatService.streamChatMessage(
        sessionId,
        textToSend,
        (chunk: string) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, text: msg.text + chunk }
                : msg
            )
          );
          setTimeout(scrollToBottom, 10);
        },
        // onComplete callback
        () => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, isTyping: false }
                : msg
            )
          );
          setLoading(false);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        },
        // onError callback
        (error: Error) => {
          console.error('Streaming error:', error);
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? {
                    ...msg,
                    text: msg.text || '죄송합니다. 메시지 처리 중 오류가 발생했습니다.',
                    isTyping: false
                  }
                : msg
            )
          );
          toast.error(error.message || '메시지 전송 실패');
          setLoading(false);
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
        }
      );
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || '메시지 전송 실패');
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '죄송합니다. 메시지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
        isTyping: false,
      };
      setMessages(prev => [...prev, errorResponse]);
      setLoading(false);
    }
  }, [inputValue, scrollToBottom, sessionId, scrapedInfo]);
  
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
    initLoading,
    sessionId,
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