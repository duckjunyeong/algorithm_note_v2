// src/components/ChatModal/ChatModal.view.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Info, Maximize, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from './useChatModal';

// Constants
const TYPING_SPEED_MS = 15;

// --- Helper Component for Typing Animation ---
const TypingMessage = ({ fullText, onComplete }: { fullText: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
        onCompleteRef.current?.();
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return <>{displayedText}</>;
};

// --- View Component Props Interface ---
interface ChatModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  title: string;
  messages: Message[];
  inputValue: string;
  loading: boolean;
  recommendedQuestions: string[];
  showSaveButton: boolean;
  setInputValue: (value: string) => void;
  handleSendMessage: (message?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleTypingComplete: (messageId: number) => void;
  handleSaveNote: (onClose: () => void) => void;
}

// --- Main View Component ---
export const ChatModalView: React.FC<ChatModalViewProps> = ({
  isOpen,
  onClose,
  onBackgroundClick,
  title,
  messages,
  inputValue,
  loading,
  recommendedQuestions,
  showSaveButton,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  handleTypingComplete,
  handleSaveNote
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onBackgroundClick || onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col w-[90%] max-w-4xl h-[85vh] overflow-hidden bg-[#1e1e1e] text-gray-100 rounded-xl border border-gray-700 shadow-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 px-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span>{title}</span>
                <span className="flex items-center gap-1.5 bg-gray-700 text-gray-400 text-xs font-medium py-1 px-2 rounded-lg">
                  <Info size={14} /> 무료 버전 적용중
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 transition-colors rounded hover:bg-gray-700 hover:text-gray-100">
                  <Maximize size={18} />
                </button>
                <button onClick={onClose} className="p-2 text-gray-400 transition-colors rounded hover:bg-gray-700 hover:text-gray-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div
              className="flex flex-col flex-grow gap-6 p-4 px-6 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1e1e1e] [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'}`}>
                  {msg.sender === 'bot' && <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 mt-1 font-bold text-sm bg-gray-700 border-2 border-gray-600 rounded-full">🤖</div>}
                  <div className={`py-3.5 px-5 bg-gray-700 rounded-xl whitespace-pre-wrap text-sm leading-relaxed ${msg.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                    {msg.sender === 'bot' && msg.isTyping ? (
                      <TypingMessage
                        fullText={msg.text}
                        onComplete={() => handleTypingComplete(msg.id)}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex self-start gap-4 max-w-[85%] mb-2">
                  <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 mt-1 font-bold text-sm bg-gray-700 border-2 border-gray-600 rounded-full">🤖</div>
                  <div className="flex items-center gap-2 px-5 py-4 text-sm bg-gray-700 rounded-xl rounded-tl-sm">
                    <div className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="p-4 px-6 border-t border-gray-700 flex-shrink-0 bg-[#1e1e1e]">
              <div className="relative flex items-center bg-gray-700 border border-gray-600 rounded-lg focus-within:border-blue-500">
                <textarea
                  placeholder="메시지를 입력하세요..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full p-3.5 text-sm bg-transparent border-none resize-none min-h-[52px] max-h-48 placeholder-gray-500 focus:outline-none"
                />
                <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || loading} className="flex items-center justify-center w-9 h-9 mr-2 text-gray-100 transition-colors bg-gray-600 rounded cursor-pointer hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600">
                  <Send size={18} />
                </button>
              </div>
              {showSaveButton && (
                <div className="flex justify-end pt-3 pr-2">
                  <button onClick={() => handleSaveNote(onClose)} disabled={loading} className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    저장
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};