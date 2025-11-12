import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createChatService, type ChatService } from '../../services/chatService';
import apiClient from '../../services/apiClient';
import type { TaskType } from '../../schemas/taskCreation.schema';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

const recommendedQuestions = [
  "안녕하세요! 태스크 계획을 세우고 싶습니다.",
  "특정 기능 구현",
  "기술적 기반 구축(인프라, 보안 등)"
];

interface ScrapedInfo {
  confirmationKey: string;
  analysisResult: any;
}

interface UseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  title?: string;
  taskType: TaskType;
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
  const chatServiceRef = useRef<ChatService | undefined>(undefined);
  const currentBotMessageIdRef = useRef<number | null>(null);

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
    if (isOpen && !chatServiceRef.current) {
      setInitLoading(true);

      chatServiceRef.current = createChatService({
        taskType,
        taskField,
        onMessage: (content) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];

            if (lastMsg?.sender === 'bot' && lastMsg.isTyping) {
              lastMsg.text += content;
            } else {
              const newBotMessage: Message = {
                id: Date.now(),
                sender: 'bot',
                text: content,
                isTyping: true
              };
              currentBotMessageIdRef.current = newBotMessage.id;
              updated.push(newBotMessage);
            }

            return updated;
          });
          setTimeout(scrollToBottom, 10);
        },
        onError: (error) => {
          console.error('Chat error:', error);
          toast.error('채팅 연결에 실패했습니다.');
          setLoading(false);
          setInitLoading(false);
        },
        onDone: () => {
          setMessages(prev =>
            prev.map(msg =>
              msg.isTyping ? { ...msg, isTyping: false } : msg
            )
          );
          setLoading(false);
          currentBotMessageIdRef.current = null;
          setTimeout(scrollToBottom, 50);
        }
      });

      (async () => {
        try {
          await chatServiceRef.current?.subscribe();

          const welcomeMessage: Message = {
            id: Date.now(),
            sender: 'bot',
            text: '안녕하세요! 학습하신 내용을 입력해주시면 맞춤 질문을 생성해드리겠습니다.',
            isTyping: false
          };
          setMessages([welcomeMessage]);
          setInitLoading(false);
        } catch (error) {
          console.error('Subscribe error:', error);
          toast.error('채팅 연결 중 오류가 발생했습니다.');
          setInitLoading(false);
        }
      })();
    }

    return () => {
      chatServiceRef.current?.disconnect();
      chatServiceRef.current = undefined;
    };
  }, [isOpen, taskType, taskField, scrollToBottom]);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = (typeof messageText === 'string' ? messageText : inputValue).trim();
    if (textToSend === '') return;

    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };
    setMessages(prev => [...prev, newUserMessage]);
    if (typeof messageText !== 'string') setInputValue('');
    setLoading(true);

    setTimeout(scrollToBottom, 10);

    try {
      await chatServiceRef.current?.sendMessage(textToSend);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || '메시지 전송 실패');
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '죄송합니다. 메시지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
        isTyping: false
      };
      setMessages(prev => [...prev, errorResponse]);
      setLoading(false);
    }
  }, [inputValue, scrollToBottom]);

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
    setTimeout(scrollToBottom, 50);
  }, [scrollToBottom]);


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
    handleTypingComplete
  };
};
