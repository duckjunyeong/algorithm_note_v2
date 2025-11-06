import { useState, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatInterfaceProps {
  category: string;
  onCategoryChange: (category: string) => void;
  onSendMessage: (message: string) => Promise<void>;
  onVoiceRecord: (audioBlob: Blob) => Promise<void>;
  messages: Message[];
  isBotTyping: boolean;
  onBack: () => void;
  onClose: () => void;
}

export function useChatInterface({
  category,
  onCategoryChange,
  onSendMessage,
  onVoiceRecord,
  messages,
  isBotTyping,
  onBack,
  onClose,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageToSend = inputValue.trim();
    setInputValue('');
    await onSendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessingAudio(true);
        await onVoiceRecord(audioBlob);
        setIsProcessingAudio(false);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    inputValue,
    setInputValue,
    isRecording,
    isProcessingAudio,
    messagesEndRef,
    category,
    onCategoryChange,
    handleSendMessage,
    handleKeyPress,
    handleMicClick,
    onBack,
    onClose,
  };
}
